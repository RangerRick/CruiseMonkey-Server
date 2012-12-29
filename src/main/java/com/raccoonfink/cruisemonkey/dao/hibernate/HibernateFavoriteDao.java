package com.raccoonfink.cruisemonkey.dao.hibernate;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

import com.raccoonfink.cruisemonkey.dao.FavoriteDao;
import com.raccoonfink.cruisemonkey.model.Favorite;

public class HibernateFavoriteDao extends AbstractHibernateDao<Favorite,Integer> implements FavoriteDao {

	@Override
	protected Class<Favorite> getClassType() {
		return Favorite.class;
	}

	@SuppressWarnings("unchecked")
	protected List<Favorite> resultWithDefaultSort(final Criteria criteria) {
		final Criteria resultCriteria = criteria
				.createAlias("user", "user")
				.addOrder(Order.asc("user.username"));

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
		Criteria criteria = session.createCriteria(Favorite.class);
		if (userName != null) {
			criteria = criteria.add(Restrictions.eq("user.username", userName).ignoreCase());
		}
		return resultWithDefaultSort(criteria);
	}

	@Override
	public Favorite findByUserAndEventId(String userName, String eventId) {
		final Session session = createSession();
		final Transaction tx = session.beginTransaction();
		
		try {
			return findByUserAndEventId(userName, eventId, session);
		} finally {
			tx.commit();
		}
	}

	public Favorite findByUserAndEventId(String userName, String eventId, final Session session) {
		if (userName == null || eventId == null) {
			throw new IllegalArgumentException("You must provide both the userName and eventId parameters!");
		}
		Criteria criteria = session.createCriteria(Favorite.class).createAlias("event", "event")
				.add(Restrictions.eq("user.username", userName).ignoreCase())
				.add(Restrictions.eq("event.id", eventId));
		final List<Favorite> favorites = resultWithDefaultSort(criteria);
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
