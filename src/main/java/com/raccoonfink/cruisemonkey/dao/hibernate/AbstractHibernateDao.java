package com.raccoonfink.cruisemonkey.dao.hibernate;

import java.io.Serializable;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;

import com.raccoonfink.cruisemonkey.dao.Dao;

public abstract class AbstractHibernateDao<T,K extends Serializable> implements Dao<T,K> {
	private final SessionFactory m_sessionFactory;

	@SuppressWarnings("deprecation")
	public AbstractHibernateDao() {
		m_sessionFactory = new Configuration().configure().buildSessionFactory();
	}
	
	protected SessionFactory getSessionFactory() {
		return m_sessionFactory;
	}
	
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
		} finally {
			tx.commit();
		}
	}

	@Override
	public void save(final T obj, final Session session) {
		session.save(obj);
	}

}
