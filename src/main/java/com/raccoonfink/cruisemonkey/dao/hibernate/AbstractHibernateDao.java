package com.raccoonfink.cruisemonkey.dao.hibernate;

import java.io.Serializable;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.raccoonfink.cruisemonkey.dao.HibernateDao;

public abstract class AbstractHibernateDao<T,K extends Serializable> implements HibernateDao<T,K> {
	final Logger m_logger = LoggerFactory.getLogger(AbstractHibernateDao.class);

	@Autowired
	private SessionFactory m_sessionFactory;

	public AbstractHibernateDao() {
	}
	
	public SessionFactory getSessionFactory() {
		return m_sessionFactory;
	}
	
	public void setSessionFactory(final SessionFactory sessionFactory) {
		m_sessionFactory = sessionFactory;
	}
	
	@Override
	public Session createSession() throws HibernateException {
		return m_sessionFactory.getCurrentSession();
	}

	protected abstract Class<T> getClassType();
	
	protected abstract List<T> resultWithDefaultSort(final Criteria criteria);

	@Override
	public List<T> findAll() {
		final Session session = createSession();
		final Transaction tx = session.beginTransaction();
		try {
			return findAll(session);
		} catch (final RuntimeException e) {
			m_logger.warn("Failed to find all objects.", e);
			tx.rollback();
			throw e;
		} finally {
			tx.commit();
		}
	}

	@Override
	public List<T> findAll(final Session session) {
		return resultWithDefaultSort(session.createCriteria(getClassType()));
	}

	@Override
	public List<T> find(final Criteria criteria) {
		return resultWithDefaultSort(criteria);
	}
	
	@Override
	public T get(final K id) {
		final Session session = createSession();
		final Transaction tx = session.beginTransaction();
		try {
			return get(id, session);
		} finally {
			tx.commit();
		}
	}

	@Override
	@SuppressWarnings("unchecked")
	public T get(final K id, final Session session) {
		return (T)session.get(getClassType(), id);
	}

	@Override
	public void delete(final T obj) {
		final Session session = createSession();
		final Transaction tx = session.beginTransaction();
		
		try {
			delete(obj, session);
		} catch (final RuntimeException e) {
			tx.rollback();
			m_logger.warn("Had to roll back delete on " + obj, e);
			throw e;
		} finally {
			tx.commit();
		}
	}

	@Override
	public void delete(final T obj, final Session session) {
		session.delete(obj);
	}

	@Override
	public void save(final T obj) {
		final Session session = createSession();
		final Transaction tx = session.beginTransaction();
		
		try {
			save(obj, session);
		} catch (final RuntimeException e) {
			m_logger.warn("Had to roll back save on " + obj, e);
			tx.rollback();
			throw e;
		} finally {
			tx.commit();
		}
	}

	@Override
	public void save(final T obj, final Session session) {
		m_logger.debug("saving: {}", obj);
		session.saveOrUpdate(obj);
	}

}
