package com.raccoonfink.cruisemonkey.dao;

import java.util.Date;
import java.util.List;

import com.raccoonfink.cruisemonkey.model.Event;

public interface EventDao extends Dao<Event,String> {
	public List<Event> findByUser(final String userName);
	public List<Event> findInRange(final Date start, final Date end, String userName);
}
