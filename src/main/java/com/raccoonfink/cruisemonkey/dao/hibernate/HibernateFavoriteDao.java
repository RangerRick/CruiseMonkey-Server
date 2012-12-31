package com.raccoonfink.cruisemonkey.dao.hibernate;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.raccoonfink.cruisemonkey.dao.FavoriteDao;
import com.raccoonfink.cruisemonkey.model.Favorite;

public class HibernateFavoriteDao extends AbstractHibernateDao<Favorite,Integer> implements FavoriteDao {
	final Logger m_logger = LoggerFactory.getLogger(HibernateFavoriteDao.class);

	@Override
	protected Class<Favorite> getClassType() {
		return Favorite.class;
	}

	@SuppressWarnings("unchecked")
	protected List<Favorite> resultWithDefaultSort(final Criteria criteria) {
		final Criteria resultCriteria = criteria.addOrder(Order.asc("user"));

		final List<Favorite> result = (List<Favorite>)resultCriteria.list();
		if (result == null) return new ArrayList<Favorite>();
		return result;
	}

	@Override
	public List<Favorite> findByUser(final String userName) {
		final Session session = createSession();
		final Transaction tx = session.beginTransaction();
		
		try {
			return findByUser(userName, session);
		} finally {
			tx.commit();
		}
	}
	
	public List<Favorite> findByUser(final String userName, final Session session) {
		m_logger.debug("userName = {}", userName);

		Criteria criteria = session.createCriteria(Favorite.class);
		if (userName != null) {
			criteria = criteria.add(Restrictions.eq("user", userName).ignoreCase());
		}
		return resultWithDefaultSort(criteria);
	}

	@Override
	public Favorite findByUserAndEventId(final String userName, final String eventId) {
		final Session session = createSession();
		final Transaction tx = session.beginTransaction();
		
		try {
			return findByUserAndEventId(userName, eventId, session);
		} finally {
			tx.commit();
		}
	}

	public Favorite findByUserAndEventId(String userName, String eventId, final Session session) {
		m_logger.debug("userName = {}, eventId = {}", userName, eventId);
		if (userName == null || eventId == null) {
			throw new IllegalArgumentException("You must provide both the userName and eventId parameters!");
		}
		Criteria criteria = session.createCriteria(Favorite.class)
				.add(Restrictions.eq("user", userName).ignoreCase())
				.add(Restrictions.eq("event", eventId))
				;
		final List<Favorite> favorites = resultWithDefaultSort(criteria);

		m_logger.debug("found favorites: {}", favorites);

		if (favorites != null) {
			if (favorites.size() > 1) {
				throw new IllegalStateException("Somehow we have more than one matching favorite!");
			} else if (favorites.size() == 1){
				return favorites.get(0);
			}
		}
		return null;
	}
}
