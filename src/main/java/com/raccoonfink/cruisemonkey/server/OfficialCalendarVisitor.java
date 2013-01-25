package com.raccoonfink.cruisemonkey.server;

import java.util.Date;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import net.fortuna.ical4j.model.Component;
import net.fortuna.ical4j.model.component.VEvent;
import net.fortuna.ical4j.model.property.Description;
import net.fortuna.ical4j.model.property.DtEnd;
import net.fortuna.ical4j.model.property.DtStart;
import net.fortuna.ical4j.model.property.Location;
import net.fortuna.ical4j.model.property.RecurrenceId;
import net.fortuna.ical4j.model.property.Summary;
import net.fortuna.ical4j.model.property.Uid;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;

import com.raccoonfink.cruisemonkey.dao.CalendarVisitor;
import com.raccoonfink.cruisemonkey.dao.EventDao;
import com.raccoonfink.cruisemonkey.dao.UserDao;
import com.raccoonfink.cruisemonkey.model.Event;
import com.raccoonfink.cruisemonkey.model.User;

public class OfficialCalendarVisitor implements CalendarVisitor, InitializingBean {
	private static Pattern m_cr      = Pattern.compile("\\\\n", Pattern.MULTILINE | Pattern.DOTALL);
    private static Pattern m_escaped = Pattern.compile("\\\\(.)", Pattern.MULTILINE | Pattern.DOTALL);
    private static Pattern m_eol     = Pattern.compile("[\\r\\n\\s]*(.*?)[\\r\\n\\s]", Pattern.MULTILINE | Pattern.DOTALL);

    private User m_importUser;

    @Autowired
    private UserDao m_userDao;

    @Autowired
    private EventDao m_eventDao;

	private long m_lastUpdated;

    public OfficialCalendarVisitor() {
    }

	@Override
	public void afterPropertiesSet() throws Exception {
		Assert.notNull(m_userDao);
		Assert.notNull(m_eventDao);
		m_importUser = m_userDao.get("official");
	}

    @Override
	public void visitEvent(final Component component) {
        final Event event = getEvent(component);
        m_eventDao.save(event);
	}

    @Override
    public void begin() {
    	m_lastUpdated = System.currentTimeMillis();
    }

    @Override
    public void end() {
    	final List<Event> events = m_eventDao.findAllAsList();

    	int count = 0;
        for (final Event event : events) {
        	if ("official".equals(event.getCreatedBy())) {
        		if (event.getCreatedDate().getTime() < m_lastUpdated) {
            		m_eventDao.delete(event);
        		} else {
        			count++;
        		}
        	}
        }

        System.out.println("added/refreshed " + count + " events");
    }

	private Event getEvent(final Component component) {
		final VEvent vevent = new VEvent(component.getProperties());

		final String id = getIdForEvent(vevent);

		final Summary summary = vevent.getSummary();
		final Description description = vevent.getDescription();
		final Location location = vevent.getLocation();
		final DtStart dtStartDate = vevent.getStartDate();
		final DtEnd dtEndDate = vevent.getEndDate();
		// final Created created = vevent.getCreated();
		final Date startDate = new Date(dtStartDate.getDate().getTime());
		final Date endDate = new Date(dtEndDate.getDate().getTime());
		final Date createdDate = new Date(m_lastUpdated);

		String summaryString = summary.getValue().trim();
		final String locationString = location.getValue().trim();
		String removeThis = " - " + locationString;
		if (summaryString.endsWith(removeThis)) {
			summaryString = summaryString.substring(0, summaryString.length() - removeThis.length());
		}
		removeThis = locationString + " - ";
		if (summaryString.startsWith(removeThis)) {
			summaryString = summaryString.substring(removeThis.length(), summaryString.length());
		}

		final Event existingEvent = m_eventDao.get(id);
		// final String username = m_importUser.getUsername();

		if (existingEvent == null) {
			final Event event = new Event();
			event.setId(id);
			event.setSummary(summaryString);
			event.setDescription(description.getValue().trim());
			event.setLocation(locationString);
			event.setIsPublic(true);
			event.setStartDate(startDate);
			event.setEndDate(endDate);
			event.setCreatedBy(m_importUser.getUsername());
			event.setCreatedDate(createdDate);
			return event;
		} else {
			System.err.println("found existing event: " + existingEvent);
			existingEvent.setSummary(summaryString);
			existingEvent.setDescription(description.getValue().trim());
			existingEvent.setLocation(locationString);
			existingEvent.setStartDate(startDate);
			existingEvent.setEndDate(endDate);
			existingEvent.setCreatedDate(createdDate);
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
