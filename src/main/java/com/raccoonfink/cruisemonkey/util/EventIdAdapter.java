package com.raccoonfink.cruisemonkey.util;

import javax.xml.bind.annotation.adapters.XmlAdapter;

import com.raccoonfink.cruisemonkey.dao.EventDao;
import com.raccoonfink.cruisemonkey.model.Event;

public class EventIdAdapter extends XmlAdapter<String,Event> {
	final EventDao m_eventDao;

	public EventIdAdapter() {
		super();
		m_eventDao = SpringApplicationContext.getBean("eventDao", EventDao.class);
	}

	@Override
	public Event unmarshal(final String eventId) throws Exception {
		return m_eventDao.get(eventId);
	}

	@Override
	public String marshal(final Event event) throws Exception {
		return event.getId();
	}
}
