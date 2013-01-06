package com.raccoonfink.cruisemonkey.server;

import java.util.Date;
import java.util.List;

import org.springframework.transaction.annotation.Transactional;

import com.raccoonfink.cruisemonkey.model.Event;

public interface EventService {
	public Event getEvent(final String id);

	public List<Event> getEvents(String userName);

	public List<Event> getEventsInRange(final Date start, final Date end, String userName);

	public void putEvent(final Event event);
}
