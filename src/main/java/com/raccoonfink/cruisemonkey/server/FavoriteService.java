package com.raccoonfink.cruisemonkey.server;

import java.util.List;

import com.raccoonfink.cruisemonkey.model.Favorite;

public interface FavoriteService {

	public List<Favorite> getFavorites(final String username);

	public Favorite getFavorite(final String username, final String eventId);

	public void addFavorite(Favorite favorite);

	public void addFavorite(final String username, final String eventId);

	public void removeFavorite(final String username, final String eventId);

	public void removeFavorite(final String username, Long id);

}
