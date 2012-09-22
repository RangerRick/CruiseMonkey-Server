package com.raccoonfink.cruisemonkey.dao.hibernate;

import java.util.Date;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

import com.raccoonfink.cruisemonkey.dao.EventDao;
import com.raccoonfink.cruisemonkey.model.Event;

public class HibernateEventDao extends AbstractHibernateDao<Event,String> implements EventDao {

	@Override
	public List<Event> findByUser(final String userName) {
		final Session session = createSession();
		final Transaction tx = session.beginTransaction();
		
		try {
			return findByUser(userName, session);
		} finally {
			tx.commit();
		}
	}
	
	public List<Event> findByUser(final String userName, final Session session) {
		Criteria criteria = session.createCriteria(Event.class);
		if (userName != null) {
			criteria = criteria.add(Restrictions.eq("createdBy", userName).ignoreCase());
		}
		return resultWithDefaultSort(criteria);
	}

	@Override
	public List<Event> findInRange(final Date start, final Date end, final String userName) {
		final Session session = createSession();
		final Transaction tx = session.beginTransaction();
		
		try {
			return findInRange(start, end, userName, session);
		} finally {
			tx.commit();
		}
	}

	public List<Event> findInRange(final Date start, final Date end, final String userName, final Session session) {
		Criteria criteria = session.createCriteria(Event.class)
				.add(Restrictions.ge("startDate", start))
				.add(Restrictions.le("endDate", end));
		if (userName != null) {
			criteria = criteria.add(Restrictions.eq("createdBy", userName).ignoreCase());
		}
		return resultWithDefaultSort(criteria);
	}

	@Override
	protected Class<Event> getClassType() {
		return Event.class;
	}

	@SuppressWarnings("unchecked")
	protected List<Event> resultWithDefaultSort(final Criteria criteria) {
		final Criteria resultCriteria = criteria
				.addOrder(Order.asc("startDate"))
				.addOrder(Order.asc("lastModifiedDate"))
				.addOrder(Order.asc("summary"));

		return (List<Event>)resultCriteria.list();
	}

}
