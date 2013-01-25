package com.raccoonfink.cruisemonkey.server;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;

import com.raccoonfink.cruisemonkey.dao.EventDao;
import com.raccoonfink.cruisemonkey.model.Event;

import edu.emory.mathcs.backport.java.util.Collections;

public class EventServiceImpl implements EventService, InitializingBean {
	final Logger m_logger = LoggerFactory.getLogger(EventServiceImpl.class);

	@Autowired
	private EventDao m_eventDao;

	@Autowired
	private UserService m_userService;

	@Override
	public void afterPropertiesSet() throws Exception {
		Assert.notNull(m_eventDao);
	}

	@Override
	public Event getEvent(final String id) {
		return m_eventDao.get(id);
	}

	@Override
	public List<Event> getEvents(final String userName) {
		return new ArrayList<Event>(m_eventDao.findByUser(userName));
	}

	@Override
	public void putEvent(final Event event) {
		m_eventDao.save(event);
	}

	@Override
	public void putEvent(final Event event, final String userName) {
		if (event.getCreatedBy() == null) {
			event.setCreatedBy(userName);
		}
		m_eventDao.save(event);
	}

	@Override
	public List<Event> getPublicEvents(final String userName) {
		if (userName == null) throw new IllegalArgumentException("You must provide a username!");

		final List<Event> events = new ArrayList<Event>();

		for (final Event event : m_eventDao.findAll()) {
			if (event.getCreatedBy().equalsIgnoreCase(userName) || event.getCreatedBy().equals("official") || event.getIsPublic() == true) {
				events.add(event);
			}
		}
		Collections.sort(events);
		return events;
	}

	@Override
	public void deleteEvent(final Event event) {
		if (event == null) throw new IllegalArgumentException("You must provide an event to delete!");
		
		m_eventDao.delete(event);
	}
}
