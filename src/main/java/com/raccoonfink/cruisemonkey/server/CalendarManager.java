package com.raccoonfink.cruisemonkey.server;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;

import net.fortuna.ical4j.data.CalendarBuilder;
import net.fortuna.ical4j.data.ParserException;
import net.fortuna.ical4j.model.Calendar;
import net.fortuna.ical4j.model.Component;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.util.Assert;

import com.raccoonfink.cruisemonkey.dao.CalendarVisitor;

public class CalendarManager implements InitializingBean {
	private static final int MINUTES = 5;

	private URL m_url;
	private CalendarVisitor m_visitor;

	private ScheduledExecutorService m_executor = Executors.newSingleThreadScheduledExecutor();

	public CalendarManager() {
	}

	public synchronized URL getUrl() {
		return m_url;
	}

	public synchronized void setUrl(final URL url) {
		m_url = url;
	}
	
	public synchronized CalendarVisitor getVisitor() {
		return m_visitor;
	}
	
	public synchronized void setVisitor(final CalendarVisitor visitor) {
		m_visitor = visitor;
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		Assert.notNull(m_url);
		Assert.notNull(m_visitor);

		System.err.println("Scheduling calendar update every " + MINUTES + " minutes.");
		getRunnable().run();
		// m_executor.schedule(getRunnable(), MINUTES, TimeUnit.MINUTES);
	}

	private Runnable getRunnable() {
		return new Runnable() {
			@Override
			public void run() {
		        final URL url = getUrl();
				System.err.println("Updating calendar information from " + url);
				try {
					final Calendar calendar = getCalendar(url);
					CalendarManager.visitCalendar(calendar, getVisitor());
				} catch (final IOException e) {
					e.printStackTrace();
				} catch (final ParserException e) {
					e.printStackTrace();
				}
			}
		};
	}

	@SuppressWarnings("unchecked")
	public static void visitCalendar(final Calendar calendar, final CalendarVisitor visitor) {
		visitor.begin();
	
	    for (final Component component : (List<Component>)calendar.getComponents()) {
	        String name = component.getName();
	
	        if ("VEVENT".equals(name)) {
	        	visitor.visitEvent(component);
//			} else if ("VTIMEZONE".equals(name)) {
//	        	visitor.visitTimezone(component);
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

	public void updateNow() {
		getRunnable().run();
	}

	
}
