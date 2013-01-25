package com.raccoonfink.cruisemonkey.dao.neo4j;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.springframework.data.neo4j.conversion.EndResult;
import org.springframework.data.neo4j.repository.GraphRepository;

import com.raccoonfink.cruisemonkey.dao.Dao;

public abstract class AbstractGraphDao<T, K extends Serializable> implements Dao<T, K> {

	protected abstract GraphRepository<T> repository();

	protected List<T> asList(final EndResult<T> result) {
		final List<T> entries = new ArrayList<T>();
		for (final Iterator<T> i = result.iterator(); i.hasNext(); ) {
			entries.add(i.next());
		}
		return entries;
	}

	@Override
	public List<T> findAll() {
		return asList(repository().findAll());
	}

	@Override
	public T get(final K id) {
		return repository().findByPropertyValue("id", id);
	}

	@Override
	public void delete(final T obj) {
		repository().delete(obj);
	}

	@Override
	public void save(final T obj) {
		repository().save(obj);
	}
}
