package com.raccoonfink.cruisemonkey.server;

import java.util.List;

import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.Transaction;
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
	public Favorite getFavorite(final String username, final Integer id) {
		final Favorite favorite = m_favoriteDao.get(id);
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
		} catch (final RuntimeException e) {
			m_logger.warn("Failed addFavorite " + favorite, e);
			tx.rollback();
			throw e;
		} finally {
			try {
				tx.commit();
			} catch (final HibernateException e) {
				m_logger.warn("Failed to commit addFavorite on " + favorite, e);
			}
		}
	}

	@Override
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
		} catch (final RuntimeException e) {
			m_logger.warn("Failed addFavorite " + username + "/" + eventId, e);
			tx.rollback();
			throw e;
		} finally {
			try {
				tx.commit();
			} catch (final HibernateException e) {
				m_logger.warn("Failed to commit addFavorite on " + username + "/" + eventId, e);
			}
		}
	}

	@Override
	public void removeFavorite(final String username, final Integer id) {
		if (username == null || id == null) {
			throw new IllegalArgumentException("You must specify a user and favorite ID!");
		}

		final Session session = m_favoriteDao.createSession();
		final Transaction tx = session.beginTransaction();

		try {
			final Favorite favorite = m_favoriteDao.get(id, session);
			if (favorite != null) {
				if (!favorite.getUser().equals(username)) {
					throw new IllegalArgumentException("You can't remove someone else's favorite!");
				}
				m_favoriteDao.delete(favorite, session);
			}
		} catch (final RuntimeException e) {
			m_logger.warn("Failed removeFavorite " + username + "/" + id, e);
			tx.rollback();
			throw e;
		} finally {
			try {
				tx.commit();
			} catch (final HibernateException e) {
				m_logger.warn("Failed to commit removeFavorite on " + username + "/" + id, e);
			}
		}
	}

	@Override
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
		} catch (final RuntimeException e) {
			m_logger.warn("Failed removeFavorite " + username + "/" + eventId, e);
			tx.rollback();
			throw e;
		} finally {
			try {
				tx.commit();
			} catch (final HibernateException e) {
				m_logger.warn("Failed to commit removeFavorite on " + username + "/" + eventId, e);
			}
		}
	}

}
