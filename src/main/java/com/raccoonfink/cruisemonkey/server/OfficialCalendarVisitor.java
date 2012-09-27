package com.raccoonfink.cruisemonkey.server;

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
import org.springframework.beans.factory.InitializingBean;
import org.springframework.util.Assert;

import com.raccoonfink.cruisemonkey.dao.CalendarVisitor;
import com.raccoonfink.cruisemonkey.dao.EventDao;
import com.raccoonfink.cruisemonkey.dao.UserDao;
import com.raccoonfink.cruisemonkey.dao.hibernate.HibernateDao;
import com.raccoonfink.cruisemonkey.model.Event;
import com.raccoonfink.cruisemonkey.model.User;

public class OfficialCalendarVisitor implements CalendarVisitor, InitializingBean {
	private static Pattern m_cr      = Pattern.compile("\\\\n", Pattern.MULTILINE | Pattern.DOTALL);
    private static Pattern m_escaped = Pattern.compile("\\\\(.)", Pattern.MULTILINE | Pattern.DOTALL);
    private static Pattern m_eol     = Pattern.compile("[\\r\\n\\s]*(.*?)[\\r\\n\\s]", Pattern.MULTILINE | Pattern.DOTALL);

    private User m_importUser;

    private UserDao m_userDao;
    private EventDao m_eventDao;
    private Session m_session         = null;
    private Transaction m_transaction = null;
	@SuppressWarnings("unused")
	private VTimeZone m_timeZone;
	private long m_lastUpdated;

    public OfficialCalendarVisitor() {
    }

	@Override
	public void afterPropertiesSet() throws Exception {
		Assert.notNull(m_userDao);
		Assert.notNull(m_eventDao);
		m_importUser = m_userDao.get("admin");
	}

    public EventDao getEventDao() {
    	return m_eventDao;
    }
    
    public void setEventDao(final EventDao eventDao) {
    	m_eventDao = eventDao;
    }

    public UserDao getUserDao() {
    	return m_userDao;
    }
    
    public void setUserDao(final UserDao userDao) {
    	m_userDao = userDao;
    }

	@Override
    @SuppressWarnings("unchecked")
	public void begin() {
    	if (m_eventDao instanceof HibernateDao<?,?>) {
            m_session = ((HibernateDao<Event,String>)m_eventDao).createSession();
            m_transaction = m_session.beginTransaction();
    	}
        m_lastUpdated = System.currentTimeMillis();
	}

    @Override
	public void visitEvent(final Component component) {
        final Event event = getEvent(component);
        m_eventDao.save(event, m_session);
	}

    @Override
    public void visitTimezone(final Component component) {
    	m_timeZone = getTimeZone(component);
    }
    
    @Override
    public void end() {
    	if (m_session != null && m_transaction != null) {
	    	final Criteria criteria = m_session.createCriteria(Event.class)
	    			.add(Restrictions.lt("lastModifiedDate", new Date(m_lastUpdated)));
	    	final List<Event> events = m_eventDao.find(criteria);
	
	        for (final Event event : events) {
	        	if (m_importUser.getUsername().equals(event.getCreatedBy())) {
	        		m_eventDao.delete(event, m_session);
	        	}
	        }
	    	// System.out.println("");
	        m_transaction.commit();
	        System.out.println("added " + m_eventDao.findAll().size() + " events");
    	}
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

		String summaryString = summary.getValue().trim();
		final String locationString = location.getValue().trim();
		final String removeThis = " - " + locationString;
		if (summaryString.endsWith(removeThis)) {
			// System.err.println("old summaryString: '" + summaryString + "'");
			summaryString = summaryString.substring(0, summaryString.length() - removeThis.length());
			// System.err.println("new summaryString: '" + summaryString + "'");
		}

		final Event existingEvent = m_eventDao.get(id, m_session);
		final String username = m_importUser.getUsername();

		if (existingEvent == null) {
			final Event event = new Event();
			event.setId(id);
			event.setSummary(summaryString);
			event.setDescription(description.getValue().trim());
			event.setLocation(locationString);
			event.setIsPublic(true);
			event.setStartDate(startDate);
			event.setEndDate(endDate);
			event.setCreatedBy(username);
			event.setCreatedDate(createdDate);
			event.setLastModifiedBy(username);
			event.setLastModifiedDate(lastModifiedDate);
			event.setOwner(m_importUser);
			return event;
		} else {
			System.err.println("found existing event: " + existingEvent);
			existingEvent.setSummary(summaryString);
			existingEvent.setDescription(description.getValue().trim());
			existingEvent.setLocation(locationString);
			existingEvent.setStartDate(startDate);
			existingEvent.setEndDate(endDate);
			existingEvent.setCreatedDate(createdDate);
			existingEvent.setLastModifiedBy(username);
			existingEvent.setLastModifiedDate(lastModifiedDate);
			existingEvent.setOwner(m_importUser);
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
