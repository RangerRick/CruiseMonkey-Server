package com.raccoonfink.cruisemonkey.dao;

import java.io.Serializable;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Session;

public interface Dao<T,K extends Serializable> {
	public List<T> findAll();
	public List<T> findAll(final Session session);

	public List<T> find(final Criteria criteria);

	public T get(final K id);
	public T get(final K id, final Session session);

	public void delete(final T obj);
	public void delete(final T obj, final Session session);

	public void save(final T obj);
	public void save(final T obj, final Session session);
}
