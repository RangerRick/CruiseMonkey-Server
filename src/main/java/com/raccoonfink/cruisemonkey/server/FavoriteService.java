package com.raccoonfink.cruisemonkey.server;

import java.util.List;

import org.springframework.transaction.annotation.Transactional;

import com.raccoonfink.cruisemonkey.model.Favorite;

public interface FavoriteService {

	@Transactional(readOnly=true)
	public List<Favorite> getFavorites(final String username);

	@Transactional(readOnly=true)
	public Favorite getFavorite(final String username, final Integer id);

	@Transactional
	public Favorite addFavorite(Favorite favorite);

	@Transactional
	public Favorite addFavorite(final String username, final String eventId);

	@Transactional
	public void removeFavorite(final String username, final String eventId);

	@Transactional
	public void removeFavorite(final String username, Integer id);

}
