package com.raccoonfink.cruisemonkey.dao.mock;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

import org.hibernate.Criteria;
import org.hibernate.Session;

import com.raccoonfink.cruisemonkey.dao.EventDao;
import com.raccoonfink.cruisemonkey.dao.FavoriteDao;
import com.raccoonfink.cruisemonkey.model.Event;
import com.raccoonfink.cruisemonkey.model.Favorite;

public class MockFavoriteDao implements FavoriteDao {
	private Set<Favorite> m_favorites = new TreeSet<Favorite>();
	private EventDao m_eventDao;

	public MockFavoriteDao(final EventDao eventDao) {
		m_eventDao = eventDao;

		final Event event = m_eventDao.findAll().iterator().next();
		final Favorite favorite = new Favorite(event.getCreatedBy(), event.getId());
		favorite.setId(1);
		m_favorites.add(favorite);
	}

	@Override
	public Session createSession() {
		return null;
	}

	@Override
	public List<Favorite> findAll() {
		return new ArrayList<Favorite>(m_favorites);
	}

	@Override
	public List<Favorite> findAll(final Session session) {
		return findAll();
	}

	@Override
	public List<Favorite> find(final Criteria criteria) {
		throw new UnsupportedOperationException("not implemented");
	}

	@Override
	public Favorite get(final Integer id) {
		for (final Favorite favorite : m_favorites) {
			if (favorite.getId() == id) {
				return favorite;
			}
		}
		return null;
	}

	@Override
	public Favorite get(final Integer id, Session session) {
		return get(id);
	}

	@Override
	public void delete(final Favorite obj) {
		m_favorites.remove(obj);
	}

	@Override
	public void delete(Favorite obj, Session session) {
		delete(obj);
	}

	@Override
	public void save(final Favorite obj) {
		m_favorites.add(obj);
	}

	@Override
	public void save(final Favorite obj, Session session) {
		m_favorites.add(obj);
	}

	@Override
	public List<Favorite> findByUser(final String userName) {
		final List<Favorite> favorites = new ArrayList<Favorite>();
		for (final Favorite favorite : m_favorites) {
			if (favorite.getUser() == userName) {
				favorites.add(favorite);
			}
		}
		return favorites;
	}
	
	@Override
	public List<Favorite> findByUser(final String userName, final Session session) {
		return findByUser(userName);
	}

	@Override
	public Favorite findByUserAndEventId(final String userName, final String eventId) {
		for (final Favorite favorite : m_favorites) {
			if (favorite.getUser() == userName && favorite.getEvent() == eventId) {
				return favorite;
			}
		}
		return null;
	}

	@Override
	public Favorite findByUserAndEventId(final String userName, final String eventId, final Session session) {
		return findByUserAndEventId(userName, eventId);
	}
}
