package com.raccoonfink.cruisemonkey.server;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.Date;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import net.fortuna.ical4j.data.CalendarBuilder;
import net.fortuna.ical4j.model.Calendar;
import net.fortuna.ical4j.model.Component;
import net.fortuna.ical4j.model.component.VEvent;
import net.fortuna.ical4j.model.component.VTimeZone;
import net.fortuna.ical4j.model.property.Description;
import net.fortuna.ical4j.model.property.DtEnd;
import net.fortuna.ical4j.model.property.DtStart;
import net.fortuna.ical4j.model.property.Uid;

import org.hibernate.Session;
import org.hibernate.Transaction;
import org.junit.Test;

import com.raccoonfink.cruisemonkey.dao.hibernate.HibernateEventDao;
import com.raccoonfink.cruisemonkey.model.Event;


public class CalendarSyncTest {
    private static Pattern m_cr      = Pattern.compile("\\\\n", Pattern.MULTILINE | Pattern.DOTALL);
    private static Pattern m_escaped = Pattern.compile("\\\\(.)", Pattern.MULTILINE | Pattern.DOTALL);
    private static Pattern m_eol     = Pattern.compile("[\\r\\n\\s]*(.*?)[\\r\\n\\s]", Pattern.MULTILINE | Pattern.DOTALL);

    @Test
    public void testGetCalendar() throws Exception {
        // final URL url = new URL("https://www.google.com/calendar/ical/nh76o8dgn9d86b7n3p3uofg1q0%40group.calendar.google.com/public/basic.ics");
        // final InputStream is = url.openStream();
        final File file = new File("src/test/resources/basic.ics");
        final InputStream is = new FileInputStream(file);
        
        final CalendarBuilder builder = new CalendarBuilder();
        final Calendar calendar = builder.build(is);
        
        is.close();

        final HibernateEventDao eventDao = new HibernateEventDao();
        final Session session = eventDao.createSession();
        final Transaction tx = session.beginTransaction();

        for (final Component component : (List<Component>)calendar.getComponents()) {
            String name = component.getName();

            VTimeZone timeZone = null;

            if ("VEVENT".equals(name)) {
                final VEvent vevent = new VEvent(component.getProperties());

                final Uid uid = vevent.getUid();
                final Description description = vevent.getDescription();
                final DtStart dtStartDate = vevent.getStartDate();
                final DtEnd dtEndDate = vevent.getEndDate();
                final Date startDate = new Date(dtStartDate.getDate().getTime());
                final Date endDate = new Date(dtEndDate.getDate().getTime());

                System.out.println("'" + unescape(description.getValue()) + "'");
                System.out.println("  start: '" + startDate + "'");
                System.out.println("  end:   '" + endDate + "'");
                
                final Event event = new Event();
                event.setId(uid.getValue());
                event.setDescription(description.getValue());
                event.setIsPublic(true);
                event.setStartDate(startDate);
                event.setEndDate(endDate);
                event.setCreatedBy("_google");
                
                eventDao.save(event, session);
            } else if ("VTIMEZONE".equals(name)) {
                timeZone = new VTimeZone(component.getProperties());
            } else {
                System.err.println("Warning: not sure how to handle " + name);
            }
            
            System.out.println("");
        }
        
        tx.commit();
    }
    
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
