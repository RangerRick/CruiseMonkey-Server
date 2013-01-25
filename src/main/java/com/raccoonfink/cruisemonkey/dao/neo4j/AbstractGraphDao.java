package com.raccoonfink.cruisemonkey.dao.neo4j;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.neo4j.graphdb.traversal.TraversalDescription;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.neo4j.conversion.EndResult;
import org.springframework.data.neo4j.repository.GraphRepository;
import org.springframework.transaction.annotation.Transactional;

import com.raccoonfink.cruisemonkey.dao.Dao;

@Transactional
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
	@Transactional(readOnly=true)
	public T get(final K id) {
		return repository().findByPropertyValue("id", id);
	}

	@Override
	public void delete(final T obj) {
		repository().delete(obj);
	}

	@Override
	public <U extends T> U save(final U entity) {
		return repository().save(entity);
	}

	@Override
	public <U extends T> Iterable<U> save(final Iterable<U> entities) {
		return repository().save(entities);
	}

	@Override
	@Transactional(readOnly=true)
	public T findOne(final Long id) {
		return repository().findOne(id);
	}

	@Override
	@Transactional(readOnly=true)
	public boolean exists(final Long id) {
		return repository().exists(id);
	}

	@Override
	@Transactional(readOnly=true)
	public List<T> findAllAsList() {
		return asList(repository().findAll());
	}

	@Override
	@Transactional(readOnly=true)
	public EndResult<T> findAll() {
		return repository().findAll();
	}

	@Override
	@Transactional(readOnly=true)
	public long count() {
		return repository().count();
	}

	@Override
	public void delete(final Iterable<? extends T> entities) {
		repository().delete(entities);
	}

	@Override
	public void deleteAll() {
		repository().deleteAll();
	}

	@Override
	@Transactional(readOnly=true)
	public EndResult<T> findAll(final Sort sort) {
		return repository().findAll(sort);
	}

	@Override
	@Transactional(readOnly=true)
	public Page<T> findAll(final Pageable pageable) {
		return repository().findAll(pageable);
	}

	@SuppressWarnings("rawtypes")
	@Override
	public Class getStoredJavaType(final Object entity) {
		return repository().getStoredJavaType(entity);
	}

	@Override
	@Transactional(readOnly=true)
	public <N> Iterable<T> findAllByTraversal(final N startNode, final TraversalDescription traversalDescription) {
		return repository().findAllByTraversal(startNode, traversalDescription);
	}

	@Override
	@Transactional(readOnly=true)
	public Iterable<T> findAll(final Iterable<Long> ids) {
		return repository().findAll(ids);
	}

	@Override
	public void delete(final Long id) {
		repository().delete(id);
	}

	@Override
	@Transactional(readOnly=true)
	public T findByPropertyValue(final String property, final Object value) {
		return repository().findByPropertyValue(property, value);
	}

	@Override
	@Transactional(readOnly=true)
	public EndResult<T> findAllByPropertyValue(final String property, final Object value) {
		return repository().findAllByPropertyValue(property, value);
	}

	@Override
	@Transactional(readOnly=true)
	public EndResult<T> findAllByQuery(final String key, final Object query) {
		return repository().findAllByQuery(key, query);
	}

	@Override
	@Transactional(readOnly=true)
	public EndResult<T> findAllByRange(final String property, final Number from, final Number to) {
		return repository().findAllByRange(property, from, to);
	}

}
