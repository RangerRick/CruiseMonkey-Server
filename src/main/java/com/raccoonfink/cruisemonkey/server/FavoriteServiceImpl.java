package com.raccoonfink.cruisemonkey.server;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.Transaction;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import com.raccoonfink.cruisemonkey.dao.FavoriteDao;
import com.raccoonfink.cruisemonkey.model.Favorite;

public class FavoriteServiceImpl implements FavoriteService, InitializingBean {
	@Autowired
	private FavoriteDao m_favoriteDao;

	public FavoriteServiceImpl() {
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		Assert.notNull(m_favoriteDao);
	}

	@Override
	@Transactional(readOnly=true)
	public Favorite getFavorite(final String username, final Integer id) {
		final Favorite favorite = m_favoriteDao.get(id);
		if (favorite.getUser() == username) {
			return favorite;
		}
		return null;
	}

	@Override
	@Transactional(readOnly=true)
	public List<Favorite> getFavorites(final String username) {
		return m_favoriteDao.findByUser(username);
	}

	@Override
	@Transactional
	public Favorite addFavorite(final Favorite favorite) {
		if (favorite == null) {
			throw new IllegalArgumentException("You must pass a favorite object!");
		}
		
		final Session session = m_favoriteDao.createSession();
		final Transaction tx = session.beginTransaction();

		try {
			final Favorite dbFavorite = m_favoriteDao.findByUserAndEventId(favorite.getUser(), favorite.getEvent(), session);
			if (dbFavorite != null) return dbFavorite;
			m_favoriteDao.save(favorite, session);
			return favorite;
		} finally {
			tx.commit();
		}
	}

	@Override
	@Transactional
	public Favorite addFavorite(final String username, final String eventId) {
		if (username == null || eventId == null) {
			throw new IllegalArgumentException("You must specify a username and eventId!");
		}

		final Session session = m_favoriteDao.createSession();
		final Transaction tx = session.beginTransaction();

		try {
			Favorite favorite = m_favoriteDao.findByUserAndEventId(username, eventId, session);
			if (favorite == null) {
				favorite = new Favorite(username, eventId);
				m_favoriteDao.save(favorite, session);
			}
			return m_favoriteDao.get(favorite.getId(), session);
		} finally {
			tx.commit();
		}
	}

	@Override
	@Transactional
	public void removeFavorite(final String username, final Integer id) {
		if (username == null || id == null) {
			throw new IllegalArgumentException("You must specify a user and favorite ID!");
		}

		final Session session = m_favoriteDao.createSession();
		final Transaction tx = session.beginTransaction();

		try {
			final Favorite favorite = m_favoriteDao.get(id, session);
			if (favorite != null) {
				if (favorite.getUser() != username) {
					throw new IllegalArgumentException("You can't remove someone else's favorite!");
				}
				m_favoriteDao.delete(favorite, session);
			}
		} finally {
			tx.commit();
		}
	}

	@Override
	@Transactional
	public void removeFavorite(final String username, final String eventId) {
		if (username == null || eventId == null) {
			throw new IllegalArgumentException("You must specify a username and eventId!");
		}

		final Session session = m_favoriteDao.createSession();
		final Transaction tx = session.beginTransaction();

		try {
			final Favorite favorite = m_favoriteDao.findByUserAndEventId(username, eventId, session);
			if (favorite != null) {
				m_favoriteDao.delete(favorite, session);
			}
		} finally {
			tx.commit();
		}
	}

}
