package com.raccoonfink.cruisemonkey.dao;

import static org.junit.Assert.assertEquals;

import java.util.Date;
import java.util.UUID;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;
import org.junit.Test;

import com.raccoonfink.cruisemonkey.model.Event;
import com.raccoonfink.cruisemonkey.model.User;

public class HibernateTest {

	@Test
	public void testUser() {
		SessionFactory factory = null;
		try {
			factory = getSessionFactory();
			
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
		} finally {
			if (factory != null) {
				factory.close();
			}
		}
	}
	
	@Test
	public void testEvent() {
		SessionFactory factory = null;
		try {
			factory = getSessionFactory();
			
			Session session = factory.getCurrentSession();
			Transaction tx = session.beginTransaction();
			
			final Event event = new Event(UUID.randomUUID().toString(), "Test description.", new Date(), new Date(), "ranger");
			final String id = (String)session.save(event);
			System.err.println("id = " + id);
			tx.commit();
		} finally {
			if (factory != null) {
				factory.close();
			}
		}
	}

	@SuppressWarnings("deprecation")
	private SessionFactory getSessionFactory() {
		return new Configuration().configure().buildSessionFactory();
	}
}
