package com.raccoonfink.cruisemonkey.server;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.List;

import net.fortuna.ical4j.data.CalendarBuilder;
import net.fortuna.ical4j.data.ParserException;
import net.fortuna.ical4j.model.Calendar;
import net.fortuna.ical4j.model.Component;

import org.junit.Before;
import org.junit.Test;

import com.raccoonfink.cruisemonkey.dao.CalendarVisitor;
import com.raccoonfink.cruisemonkey.dao.EventDao;
import com.raccoonfink.cruisemonkey.dao.hibernate.HibernateEventDao;
import com.raccoonfink.cruisemonkey.dao.hibernate.OfficialCalendarVisitor;
import com.raccoonfink.cruisemonkey.model.Event;

public class CalendarTest {
	private EventDao m_eventDao;
	
	@Before
	public void setUp() {
		m_eventDao = new HibernateEventDao();
	}

	@Test
    public void testOfficialCalendarVisitor() throws Exception {
        // final URL url = new URL("https://www.google.com/calendar/ical/nh76o8dgn9d86b7n3p3uofg1q0%40group.calendar.google.com/public/basic.ics");
        final URL url = new File("src/test/resources/before.ics").toURI().toURL();

        final Calendar calendar = getCalendar(url);
        final CalendarVisitor visitor = new OfficialCalendarVisitor();
        visitCalendar(calendar, visitor);
        
        final List<Event> events = m_eventDao.findAll();
        assertEquals(2, events.size());
        assertEquals(1347312600000L, events.get(0).getStartDate().getTime());
    }

	@Test
    public void testOfficialCalendarVisitorUpdate() throws Exception {
        // final URL url = new URL("https://www.google.com/calendar/ical/nh76o8dgn9d86b7n3p3uofg1q0%40group.calendar.google.com/public/basic.ics");
        final CalendarVisitor visitor = new OfficialCalendarVisitor();

		final Calendar beforeCalendar = getCalendar(new File("src/test/resources/before.ics").toURI().toURL());
        visitCalendar(beforeCalendar, visitor);
        
        final List<Event> beforeEvents = m_eventDao.findAll();
        assertEquals(2, beforeEvents.size());
        assertEquals(1347312600000L, beforeEvents.get(0).getStartDate().getTime());
        assertEquals("A", beforeEvents.get(0).getSummary());
        assertEquals("B", beforeEvents.get(1).getSummary());

		final Calendar afterCalendar = getCalendar(new File("src/test/resources/after.ics").toURI().toURL());
        visitCalendar(afterCalendar, visitor);
        
        final List<Event> afterEvents = m_eventDao.findAll();
        assertEquals(2, afterEvents.size());
        assertEquals("A", afterEvents.get(0).getSummary());
        assertEquals("C", afterEvents.get(1).getSummary());
	}

	@Test
    public void testOfficialCalendarVisitorUpdateJccc2() throws Exception {
        // final URL url = new URL("https://www.google.com/calendar/ical/nh76o8dgn9d86b7n3p3uofg1q0%40group.calendar.google.com/public/basic.ics");
        final CalendarVisitor visitor = new OfficialCalendarVisitor();

		final Calendar beforeCalendar = getCalendar(new File("src/test/resources/jccc2-before.ics").toURI().toURL());
        visitCalendar(beforeCalendar, visitor);
        
        final List<Event> beforeEvents = m_eventDao.findAll();
        assertEquals(2, beforeEvents.size());
        assertEquals("DRAMA CLUB with Bill Corbett & Peter Sagal - Culinary Arts Center", beforeEvents.get(0).getSummary());
        assertEquals("JCCC2 \"Official\" Group Photo", beforeEvents.get(1).getSummary());

		final Calendar afterCalendar = getCalendar(new File("src/test/resources/jccc2-after.ics").toURI().toURL());
        visitCalendar(afterCalendar, visitor);
        
        final List<Event> afterEvents = m_eventDao.findAll();
        assertEquals(66, afterEvents.size());
        
        final Event modifiedEvent = m_eventDao.get("u3lhp5hr1t68i8sescon20htps@google.com:20110103T220000");
        assertEquals("DRAMA CLUB with Bill Corbett & Peter Sagal - Culinary Arts Center 2", modifiedEvent.getSummary());
        
        final Event deletedEvent = m_eventDao.get("9p9ueqvvu0t9moajheeodo4ros@google.com");
        assertNull(deletedEvent);
	}

	@SuppressWarnings("unchecked")
	private void visitCalendar(final Calendar calendar, final CalendarVisitor visitor) {
		visitor.begin();

        for (final Component component : (List<Component>)calendar.getComponents()) {
            String name = component.getName();

            if ("VEVENT".equals(name)) {
            	visitor.visitEvent(component);
            } else if ("VTIMEZONE".equals(name)) {
            	visitor.visitTimezone(component);
            } else {
                System.err.println("Warning: not sure how to handle " + name);
            }
        }

        visitor.end();
	}

	private Calendar getCalendar(final URL url) throws IOException, ParserException {
		final InputStream is = url.openStream();
        final CalendarBuilder builder = new CalendarBuilder();
        final Calendar calendar = builder.build(is);
        is.close();
		return calendar;
	}
}
