package com.raccoonfink.cruisemonkey.dao;

import java.io.Serializable;
import java.util.List;

import org.hibernate.Criteria;

public interface Dao<T,K extends Serializable> {
	public List<T> findAll();
	public List<T> find(final Criteria criteria);
	public T get(final K id);
	public void delete(final T obj);
	public void save(final T obj);
}
