package com.raccoonfink.cruisemonkey.dao;

import java.io.Serializable;
import java.util.List;

import org.springframework.data.neo4j.repository.GraphRepository;

public interface Dao<T,K extends Serializable> extends GraphRepository<T> {
	public List<T> findAllAsList();
	public T get(final K id);
	public void delete(final T obj);
}
