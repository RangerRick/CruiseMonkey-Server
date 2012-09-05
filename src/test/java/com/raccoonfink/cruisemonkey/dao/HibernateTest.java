package com.raccoonfink.cruisemonkey.dao;

import static org.junit.Assert.assertEquals;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;
import org.junit.Test;

import com.raccoonfink.cruisemonkey.model.User;

public class HibernateTest {

	@Test
	public void testUser() {
		final SessionFactory factory = getSessionFactory();
		
		Session session = factory.getCurrentSession();
		Transaction tx = session.beginTransaction();
		
		final User user = new User("ranger", "ranger", "Benjamin Reed");
		final String id = (String)session.save(user);
		System.err.println("id = " + id);
		tx.commit();
		
		session = factory.getCurrentSession();
		tx = session.beginTransaction();
		final User newUser = (User)session.get(User.class, "ranger");
		assertEquals("ranger", newUser.getUsername());
	}

	@SuppressWarnings("deprecation")
	private SessionFactory getSessionFactory() {
		/*
		final Configuration configuration = new Configuration();
	    configuration.configure();
	    final ServiceRegistry serviceRegistry = new ServiceRegistryBuilder().applySettings(configuration.getProperties()).buildServiceRegistry();        
	    return configuration.buildSessionFactory(serviceRegistry);
	    */
		return new Configuration().configure().buildSessionFactory();
	}
}
