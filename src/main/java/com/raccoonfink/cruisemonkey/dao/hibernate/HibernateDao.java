package com.raccoonfink.cruisemonkey.dao.hibernate;

import java.io.Serializable;

import org.hibernate.HibernateException;
import org.hibernate.Session;

import com.raccoonfink.cruisemonkey.dao.Dao;

public interface HibernateDao<T,K extends Serializable> extends Dao<T,K> {
	public Session createSession() throws HibernateException;
}
