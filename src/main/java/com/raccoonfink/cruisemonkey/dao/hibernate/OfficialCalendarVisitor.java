package com.raccoonfink.cruisemonkey.dao.hibernate;

import java.util.Date;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import net.fortuna.ical4j.model.Component;
import net.fortuna.ical4j.model.component.VEvent;
import net.fortuna.ical4j.model.component.VTimeZone;
import net.fortuna.ical4j.model.property.Created;
import net.fortuna.ical4j.model.property.Description;
import net.fortuna.ical4j.model.property.DtEnd;
import net.fortuna.ical4j.model.property.DtStart;
import net.fortuna.ical4j.model.property.Location;
import net.fortuna.ical4j.model.property.RecurrenceId;
import net.fortuna.ical4j.model.property.Summary;
import net.fortuna.ical4j.model.property.Uid;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;

import com.raccoonfink.cruisemonkey.dao.CalendarVisitor;
import com.raccoonfink.cruisemonkey.model.Event;

public class OfficialCalendarVisitor implements CalendarVisitor {
    private static final String IMPORT_USERNAME = "_google";
	private static Pattern m_cr      = Pattern.compile("\\\\n", Pattern.MULTILINE | Pattern.DOTALL);
    private static Pattern m_escaped = Pattern.compile("\\\\(.)", Pattern.MULTILINE | Pattern.DOTALL);
    private static Pattern m_eol     = Pattern.compile("[\\r\\n\\s]*(.*?)[\\r\\n\\s]", Pattern.MULTILINE | Pattern.DOTALL);

    private final HibernateEventDao m_eventDao;
    private Session m_session         = null;
    private Transaction m_transaction = null;
	@SuppressWarnings("unused")
	private VTimeZone m_timeZone;
	private long m_lastUpdated;

    public OfficialCalendarVisitor() {
    	m_eventDao = new HibernateEventDao();
    }

	@Override
	public void begin() {
        m_session = m_eventDao.createSession();
        m_transaction = m_session.beginTransaction();
        m_lastUpdated = System.currentTimeMillis();
	}

    @Override
	public void visitEvent(final Component component) {
        final Event event = getEvent(component);
        m_eventDao.save(event, m_session);
        
        /*
		System.out.println("'" + unescape(event.getDescription()) + "'");
		System.out.println("  start: '" + event.getStartDate() + "'");
		System.out.println("  end:   '" + event.getEndDate() + "'");
		*/
	}

    @Override
    public void visitTimezone(final Component component) {
    	m_timeZone = getTimeZone(component);
    }
    
    @Override
    public void end() {
    	final Criteria criteria = m_session.createCriteria(Event.class)
    			.add(Restrictions.lt("lastModifiedDate", new Date(m_lastUpdated)));
    	final List<Event> events = m_eventDao.find(criteria);

        for (final Event event : events) {
        	if (IMPORT_USERNAME.equals(event.getCreatedBy())) {
        		m_eventDao.delete(event, m_session);
        	}
        }
    	// System.out.println("");
        m_transaction.commit();
        
    }

    private VTimeZone getTimeZone(final Component component) {
		return new VTimeZone(component.getProperties());
	}

	private Event getEvent(final Component component) {
		final VEvent vevent = new VEvent(component.getProperties());

		final String id = getIdForEvent(vevent);

		final Summary summary = vevent.getSummary();
		final Description description = vevent.getDescription();
		final Location location = vevent.getLocation();
		final DtStart dtStartDate = vevent.getStartDate();
		final DtEnd dtEndDate = vevent.getEndDate();
		final Created created = vevent.getCreated();
		// final LastModified lastModified = vevent.getLastModified();
		final Date startDate = new Date(dtStartDate.getDate().getTime());
		final Date endDate = new Date(dtEndDate.getDate().getTime());
		final Date createdDate = new Date(created.getDate().getTime());
		// final Date lastModifiedDate = new Date(lastModified.getDate().getTime());
		final Date lastModifiedDate = new Date(m_lastUpdated);

		final Event existingEvent = m_eventDao.get(id, m_session);

		System.err.println("found existing event: " + existingEvent);
		if (existingEvent == null) {
			final Event event = new Event();
			event.setId(id);
			event.setSummary(summary.getValue());
			event.setDescription(description.getValue());
			event.setLocation(location.getValue());
			event.setIsPublic(true);
			event.setStartDate(startDate);
			event.setEndDate(endDate);
			event.setCreatedBy(IMPORT_USERNAME);
			event.setCreatedDate(createdDate);
			event.setLastModifiedBy(IMPORT_USERNAME);
			event.setLastModifiedDate(lastModifiedDate);
			return event;
		} else {
			existingEvent.setSummary(summary.getValue());
			existingEvent.setDescription(description.getValue());
			existingEvent.setLocation(location.getValue());
			existingEvent.setStartDate(startDate);
			existingEvent.setEndDate(endDate);
			existingEvent.setCreatedDate(createdDate);
			existingEvent.setLastModifiedBy(IMPORT_USERNAME);
			existingEvent.setLastModifiedDate(lastModifiedDate);
			return existingEvent;
		}
	}

	private String getIdForEvent(final VEvent vevent) {
		final StringBuilder sb = new StringBuilder();

		final Uid uid = vevent.getUid();
		final RecurrenceId rid = vevent.getRecurrenceId();

		if (uid != null && uid.getValue() != null) {
			sb.append(uid.getValue());
		}
		if (rid != null && rid.getValue() != null) {
			if (sb.length() > 0) {
				sb.append(":");
			}
			sb.append(rid.getValue());
		}

		return sb.toString();
	}

    @SuppressWarnings("unused")
	private String unescape(final String text) {
        final String no_rs = text.replaceAll("\\\\r", "");
        final Matcher cr      = m_cr.matcher(no_rs);
        final String has_crs = cr.replaceAll("\n");
        final Matcher escaped = m_escaped.matcher(has_crs);
        final String is_escaped = escaped.replaceAll("$1");
        final Matcher eol     = m_eol.matcher(is_escaped);
        if (eol.matches()) {
            return eol.group(1).trim();
        } else {
            return is_escaped;
        }
    }
    
}
