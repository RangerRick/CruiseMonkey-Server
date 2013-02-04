package com.raccoonfink.cruisemonkey.server;

import static org.junit.Assert.assertEquals;

import java.io.File;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.raccoonfink.cruisemonkey.dao.EventDao;
import com.raccoonfink.cruisemonkey.model.Event;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={
		"classpath:/META-INF/spring/dao-context.xml",
		"classpath:/META-INF/spring/server-context.xml"
})
public class CalendarTest {
	@Autowired
	private EventDao m_eventDao;
	
	@Autowired
	private GoogleCalendarVisitor m_visitor;

	private DateFormat m_simpleFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");
	
	@Before
	public void setUp() {
		m_eventDao.deleteAll();
	}

	@Test
    public void testOfficialCalendarVisitor() throws Exception {
        // final URL url = new URL("https://www.google.com/calendar/ical/nh76o8dgn9d86b7n3p3uofg1q0%40group.calendar.google.com/public/basic.ics");
        final CalendarManager manager = new CalendarManager();
        manager.setUrl(new File("src/test/resources/before.ics").toURI().toURL());
		manager.setVisitor(m_visitor);
        manager.updateNow();
        
        final List<Event> events = m_eventDao.findAllAsList();
        Collections.sort(events);
        assertEquals(2, events.size());
        assertEquals(1347312600000L, events.get(0).getStartDate().getTime());
    }

	@Test
    public void testOfficialCalendarVisitorUpdate() throws Exception {
        // final URL url = new URL("https://www.google.com/calendar/ical/nh76o8dgn9d86b7n3p3uofg1q0%40group.calendar.google.com/public/basic.ics");
		final CalendarManager manager = new CalendarManager();
        manager.setVisitor(m_visitor);
        manager.setUrl(new File("src/test/resources/before.ics").toURI().toURL());
        manager.updateNow();
        
        final List<Event> beforeEvents = m_eventDao.findAllAsList();
        Collections.sort(beforeEvents);
        assertEquals(2, beforeEvents.size());
        assertEquals(1347312600000L, beforeEvents.get(0).getStartDate().getTime());
        assertEquals("A", beforeEvents.get(0).getSummary());
        assertEquals("B", beforeEvents.get(1).getSummary());

		manager.setUrl(new File("src/test/resources/after.ics").toURI().toURL());
        manager.updateNow();
        
        final List<Event> afterEvents = m_eventDao.findAllAsList();
        Collections.sort(afterEvents);
        System.err.println("events = " + afterEvents);
        assertEquals(2, afterEvents.size());
        assertEquals(1347312600000L, beforeEvents.get(0).getStartDate().getTime());
        assertEquals("A", afterEvents.get(0).getSummary());
        assertEquals("C", afterEvents.get(1).getSummary());
	}

	@Test
	public void testJccc3() throws Exception {
		final CalendarManager manager = new CalendarManager();
		manager.setVisitor(m_visitor);
        manager.setUrl(new File("src/test/resources/jccc3.ics").toURI().toURL());
        manager.updateNow();
        
        final List<Event> events = m_eventDao.findAllAsList();
        Collections.sort(events);

        System.err.println("=========================================================================================");
        for (final Event event : events) {
        	System.err.println(m_simpleFormat .format(event.getStartDate()) + "-" + m_simpleFormat.format(event.getEndDate()) + ": " + event.getSummary());
        }
        assertEquals(35, events.size());
	}
}
