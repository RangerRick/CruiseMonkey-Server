package com.raccoonfink.cruisemonkey.dao;

import java.util.Date;
import java.util.List;

import com.raccoonfink.cruisemonkey.model.Event;

public interface EventDao {
	public List<Event> findAll();
	public List<Event> findInRange(final Date start, final Date end);
	public Event get(final int id);
	public void save(final Event event);
}
