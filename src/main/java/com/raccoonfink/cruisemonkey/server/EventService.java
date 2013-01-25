package com.raccoonfink.cruisemonkey.server;

import java.util.List;

import com.raccoonfink.cruisemonkey.model.Event;

public interface EventService {
	public Event getEvent(final String id);

	public List<Event> getEvents(String userName);

	public List<Event> getPublicEvents(String userName);
	
	public void putEvent(final Event event);

	public void putEvent(final Event event, final String user);

	public void deleteEvent(final Event event);
}
