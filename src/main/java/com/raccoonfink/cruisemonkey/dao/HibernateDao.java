package com.raccoonfink.cruisemonkey.dao;

import java.io.Serializable;

import org.hibernate.HibernateException;
import org.hibernate.Session;

public interface HibernateDao<T,K extends Serializable> extends Dao<T,K> {
	public Session createSession() throws HibernateException;
}
