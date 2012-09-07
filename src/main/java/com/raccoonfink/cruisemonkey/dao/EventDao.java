package com.raccoonfink.cruisemonkey.dao;

import java.util.Date;
import java.util.List;

import org.hibernate.Session;

import com.raccoonfink.cruisemonkey.model.Event;

public interface EventDao extends Dao<Event,String> {
	public List<Event> findInRange(final Date start, final Date end);
	public void save(final Event event, final Session session);
}
