package com.raccoonfink.cruisemonkey.server;

import java.util.Date;
import java.util.List;

import org.springframework.transaction.annotation.Transactional;

import com.raccoonfink.cruisemonkey.model.Event;

@Transactional
public interface EventService {
	@Transactional(readOnly=true)
	public Event getEvent(final String id);

	@Transactional(readOnly=true)
	public List<Event> getEvents(String userName);

	@Transactional(readOnly=true)
	public List<Event> getEventsInRange(final Date start, final Date end, String userName);

	@Transactional
	public void putEvent(final Event event);
}
