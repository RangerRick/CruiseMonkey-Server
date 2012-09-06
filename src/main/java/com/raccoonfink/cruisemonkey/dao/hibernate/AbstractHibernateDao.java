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
	
	protected Session createSession() throws HibernateException {
		return m_sessionFactory.getCurrentSession();
	}

	protected abstract Class<T> getClassType();
	
	protected abstract List<T> resultWithDefaultSort(final Criteria criteria);

	@Override
	public List<T> findAll() {
		final Session session = createSession();
		final Transaction tx = session.beginTransaction();
		try {
			return resultWithDefaultSort(session.createCriteria(getClassType()));
		} finally {
			tx.commit();
		}
	}

	@Override
	@SuppressWarnings("unchecked")
	public T get(final K id) {
		final Session session = createSession();
		final Transaction tx = session.beginTransaction();
		
		try {
			return (T)session.get(getClassType(), id);
		} finally {
			tx.commit();
		}
	}

	@Override
	public void save(final T obj) {
		final Session session = createSession();
		final Transaction tx = session.beginTransaction();
		
		try {
			session.save(obj);
		} finally {
			tx.commit();
		}
	}
}
