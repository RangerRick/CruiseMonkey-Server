package com.raccoonfink.cruisemonkey.server;

import java.util.List;

import com.raccoonfink.cruisemonkey.model.Favorite;

public interface FavoriteService {

	public List<Favorite> getFavorites(final String username);

	public Favorite getFavorite(final String username, final Integer id);

	public Favorite addFavorite(Favorite favorite);

	public Favorite addFavorite(final String username, final String eventId);

	public void removeFavorite(final String username, final String eventId);

	public void removeFavorite(final String username, Integer id);

}
