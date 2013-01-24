package com.raccoonfink.cruisemonkey.dao.hibernate;

import java.io.Serializable;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
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
	
	protected Session createSession() throws HibernateException {
		return m_sessionFactory.getCurrentSession();
	}

	protected abstract Class<T> getClassType();
	
	protected abstract List<T> resultWithDefaultSort(final Criteria criteria);

	@Override
	public List<T> findAll() {
		return resultWithDefaultSort(createSession().createCriteria(getClassType()));
	}

	@Override
	public List<T> find(final Criteria criteria) {
		return resultWithDefaultSort(criteria);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public T get(final K id) {
		return (T)createSession().get(getClassType(), id);
	}

	@Override
	public void delete(final T obj) {
		createSession().delete(obj);
	}

	@Override
	public void save(final T obj) {
		m_logger.debug("saving: {}", obj);
		createSession().saveOrUpdate(obj);
	}

}
