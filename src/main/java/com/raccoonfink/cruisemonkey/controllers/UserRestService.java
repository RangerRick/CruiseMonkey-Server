package com.raccoonfink.cruisemonkey.controllers;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriInfo;

import org.hibernate.HibernateException;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import com.raccoonfink.cruisemonkey.model.User;
import com.raccoonfink.cruisemonkey.server.UserService;
import com.sun.jersey.api.core.InjectParam;
import com.sun.jersey.api.spring.Autowire;

@Component
@Scope("request")
@Path("/users")
@Autowire
public class UserRestService implements InitializingBean {
	final Logger m_logger = LoggerFactory.getLogger(UserRestService.class);

	@InjectParam("userService")
	@Autowired
	UserService m_userService;

	@InjectParam("sessionFactory")
	@Autowired
	SessionFactory m_sessionFactory;

	@Context
	UriInfo m_uriInfo;

    public UserRestService() {}

	public UserRestService(
		@InjectParam("userService") final UserService userService,
		@InjectParam("sessionFactory") final SessionFactory sessionFactory
	) {
		m_userService = userService;
		m_sessionFactory = sessionFactory;
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		Assert.notNull(m_userService);
		Assert.notNull(m_sessionFactory);
	}

	@GET
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	@Transactional(readOnly=true)
	public List<User> getAllUsers() {
		final Transaction tx = m_sessionFactory.getCurrentSession().beginTransaction();
		
		try {
			return m_userService.getUsers();
		} catch (final HibernateException e) {
			m_logger.warn("Failed to get user list", e);
			tx.rollback();
			return new ArrayList<User>();
		} finally {
			tx.commit();
		}
	}

	@GET
	@Path("/{username}")
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	@Transactional(readOnly=true)
	public User getUser(@PathParam("username") final String username) {
		final Transaction tx = m_sessionFactory.getCurrentSession().beginTransaction();
		
		try {
			return m_userService.getUser(username);
		} catch (final HibernateException e) {
			m_logger.warn("Failed to get user list", e);
			tx.rollback();
			return null;
		} finally {
			tx.commit();
		}
	}
}
