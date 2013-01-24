package com.raccoonfink.cruisemonkey.dao;

import java.util.List;

import org.hibernate.Session;

import com.raccoonfink.cruisemonkey.model.Favorite;

public interface FavoriteDao extends Dao<Favorite,Integer> {
	public List<Favorite> findByUser(final String userName);
	public Favorite findByUserAndEventId(final String userName, final String eventId);
}
