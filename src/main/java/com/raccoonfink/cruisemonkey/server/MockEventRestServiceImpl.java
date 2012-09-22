package com.raccoonfink.cruisemonkey.server;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;

import com.google.common.collect.Lists;
import com.raccoonfink.cruisemonkey.dao.EventDao;
import com.raccoonfink.cruisemonkey.model.Event;

public class MockEventRestServiceImpl implements EventRestService, InitializingBean {
	@Autowired
	private EventDao m_eventDao;

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
		return Lists.newArrayList(m_eventDao.findByUser(userName));
	}

	@Override
	public List<Event> getEventsInRange(final Date start, final Date end, final String userName) {
		return Lists.newArrayList(m_eventDao.findInRange(start, end, userName));
	}

	@Override
	public void putEvent(final Event event) {
		m_eventDao.save(event);
	}

}
