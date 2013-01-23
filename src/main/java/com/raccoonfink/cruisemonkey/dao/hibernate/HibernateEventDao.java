package com.raccoonfink.cruisemonkey.dao.hibernate;

import java.util.Date;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.raccoonfink.cruisemonkey.dao.EventDao;
import com.raccoonfink.cruisemonkey.model.Event;

public class HibernateEventDao extends AbstractHibernateDao<Event,String> implements EventDao {
	final Logger m_logger = LoggerFactory.getLogger(HibernateEventDao.class);

	@Override
	public List<Event> findByUser(final String userName) {
		final Session session = createSession();
		final Transaction tx = session.beginTransaction();
		
		try {
			return findByUser(userName, session);
		} catch (final RuntimeException e) {
			m_logger.warn("Failed findByUser for user: " + userName, e);
			tx.rollback();
			throw e;
		} finally {
			tx.commit();
		}
	}
	
	public List<Event> findByUser(final String userName, final Session session) {
		m_logger.debug("userName = {}", userName);
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
		} catch (final RuntimeException e) {
			m_logger.warn("Failed findInRange for user " + userName, e);
			tx.rollback();
			throw e;
		} finally {
			tx.commit();
		}
	}

	public List<Event> findInRange(final Date start, final Date end, final String userName, final Session session) {
		m_logger.debug("start = {}, end = {}, userName = {}", start, end, userName);
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
				.addOrder(Order.asc("createdDate"))
				.addOrder(Order.asc("summary"));

		return (List<Event>)resultCriteria.list();
	}

}
