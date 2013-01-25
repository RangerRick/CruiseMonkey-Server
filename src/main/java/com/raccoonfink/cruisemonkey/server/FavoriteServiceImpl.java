package com.raccoonfink.cruisemonkey.server;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;

import com.raccoonfink.cruisemonkey.dao.FavoriteDao;
import com.raccoonfink.cruisemonkey.model.Favorite;

public class FavoriteServiceImpl implements FavoriteService, InitializingBean {
	final Logger m_logger = LoggerFactory.getLogger(FavoriteServiceImpl.class);

	@Autowired
	private FavoriteDao m_favoriteDao;

	public FavoriteServiceImpl() {
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		Assert.notNull(m_favoriteDao);
	}

	@Override
	public Favorite getFavorite(final String username, final String eventId) {
		final Favorite favorite = m_favoriteDao.findByUserAndEventId(username, eventId);
		if (favorite.getUser().equals(username)) {
			return favorite;
		}
		return null;
	}

	@Override
	public List<Favorite> getFavorites(final String username) {
		return m_favoriteDao.findByUser(username);
	}

	@Override
	public void addFavorite(final Favorite favorite) {
		if (favorite == null) {
			throw new IllegalArgumentException("You must pass a favorite object!");
		}
		
		final Favorite dbFavorite = m_favoriteDao.findByUserAndEventId(favorite.getUser(), favorite.getEvent());
		if (dbFavorite == null) m_favoriteDao.save(favorite);
	}

	@Override
	public void addFavorite(final String username, final String eventId) {
		if (username == null || eventId == null) {
			throw new IllegalArgumentException("You must specify a username and eventId!");
		}

		Favorite favorite = m_favoriteDao.findByUserAndEventId(username, eventId);
		if (favorite == null) {
			favorite = new Favorite(username, eventId);
			m_favoriteDao.save(favorite);
		}
	}

	@Override
	public void removeFavorite(final String username, final Long id) {
		if (username == null || id == null) {
			throw new IllegalArgumentException("You must specify a user and favorite ID!");
		}

		final Favorite favorite = m_favoriteDao.get(id);
		if (favorite != null) {
			if (!favorite.getUser().equals(username)) {
				throw new IllegalArgumentException("You can't remove someone else's favorite!");
			}
			m_favoriteDao.delete(favorite);
		}
	}

	@Override
	public void removeFavorite(final String username, final String eventId) {
		if (username == null || eventId == null) {
			throw new IllegalArgumentException("You must specify a username and eventId!");
		}

		final Favorite favorite = m_favoriteDao.findByUserAndEventId(username, eventId);
		if (favorite != null) {
			m_favoriteDao.delete(favorite);
		}
	}

}
