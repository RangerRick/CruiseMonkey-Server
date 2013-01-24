package com.raccoonfink.cruisemonkey.controllers;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
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

import com.raccoonfink.cruisemonkey.dao.EventDao;
import com.raccoonfink.cruisemonkey.dao.FavoriteDao;
import com.raccoonfink.cruisemonkey.dao.UserDao;
import com.raccoonfink.cruisemonkey.model.Favorite;
import com.raccoonfink.cruisemonkey.server.FavoriteService;
import com.sun.jersey.api.core.InjectParam;
import com.sun.jersey.api.spring.Autowire;

@Component
@Scope("request")
@Path("/favorites")
@Autowire
public class FavoriteRestService extends RestServiceBase implements InitializingBean {
	final Logger m_logger = LoggerFactory.getLogger(FavoriteRestService.class);

	@InjectParam("favoriteDao")
	@Autowired
	FavoriteDao m_favoriteDao;

	@InjectParam("eventDao")
	@Autowired
	EventDao m_eventDao;

	@InjectParam("userDao")
	@Autowired
	UserDao m_userDao;

	@InjectParam("favoriteService")
	@Autowired
	FavoriteService m_favoriteService;

	@InjectParam("sessionFactory")
	@Autowired
	SessionFactory m_sessionFactory;

	@Context
	UriInfo m_uriInfo;

	public FavoriteRestService() {}

	public FavoriteRestService(
			@InjectParam("favoriteDao") final FavoriteDao favoriteDao,
			@InjectParam("eventDao") final EventDao eventDao,
			@InjectParam("userDao") final UserDao userDao,
			@InjectParam("userDao") final FavoriteService favoriteService,
			@InjectParam("sessionFactory") final SessionFactory sessionFactory
			) {
		m_favoriteDao = favoriteDao;
		m_eventDao = eventDao;
		m_userDao = userDao;
		m_favoriteService = favoriteService;
		m_sessionFactory = sessionFactory;
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		super.afterPropertiesSet();
		Assert.notNull(m_favoriteDao);
		Assert.notNull(m_eventDao);
		Assert.notNull(m_userDao);
		Assert.notNull(m_favoriteService);
		Assert.notNull(m_sessionFactory);
	}

    @GET
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	@Transactional(readOnly=true)
	public List<Favorite> getFavorites(@QueryParam("user") final String userName) {
		final String user = userName == null? getCurrentUser() : userName;
		m_logger.debug("user = {}", user);
		
		final Transaction tx = m_sessionFactory.getCurrentSession().beginTransaction();
		
		try {
			return m_favoriteService.getFavorites(user);
		} catch (final HibernateException e) {
			m_logger.warn("Failed to get favorites for " + userName, e);
			tx.rollback();
			return new ArrayList<Favorite>();
		} finally {
			tx.commit();
		}
	}

	@GET
	@Path("/{id}")
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	@Transactional(readOnly=true)
	public Favorite getFavorite(@PathParam("id") final Integer id) {
		final String user = getCurrentUser();
		m_logger.debug("user = {}, id = {}", user, id);

		final Transaction tx = m_sessionFactory.getCurrentSession().beginTransaction();
		
		try {
			return m_favoriteService.getFavorite(user, id);
		} catch (final HibernateException e) {
			m_logger.warn("Failed to get favorite " + id, e);
			tx.rollback();
			return null;
		} finally {
			tx.commit();
		}
	}

	@PUT
	@Transactional
	public Response putFavorite(@QueryParam("event") final String eventId) {
		final String userName = getCurrentUser();

		m_logger.debug("user = {}, event = {}", userName, eventId);
		if (userName == null || eventId == null) {
			return Response.serverError().build();
		}

		final Transaction tx = m_sessionFactory.getCurrentSession().beginTransaction();
		
		try {
			final Favorite favorite = m_favoriteService.addFavorite(userName, eventId);
			m_logger.debug("created: {}", favorite);
			return Response.seeOther(getRedirectUri(m_uriInfo, favorite.getId())).build();
		} catch (final HibernateException e) {
			m_logger.warn("Failed to put favorite " + eventId, e);
			tx.rollback();
			return Response.serverError().build();
		} finally {
			tx.commit();
		}
	}

	@POST
	@Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	@Transactional
	public Response postFavorite(final Favorite favorite) {
		final String userName = getCurrentUser();
		
		if (!userName.equals(favorite.getUser())) {
			throw new IllegalArgumentException("You cannot create favorites for other users!");
		}

		final Transaction tx = m_sessionFactory.getCurrentSession().beginTransaction();
		
		try {
			final Favorite saved = m_favoriteService.addFavorite(favorite);
			m_logger.debug("saved favorite = {}", favorite);
			return Response.seeOther(getRedirectUri(m_uriInfo, saved.getId())).build();
		} catch (final HibernateException e) {
			m_logger.warn("Failed to put favorite " + favorite.getEvent(), e);
			tx.rollback();
			return Response.serverError().build();
		} finally {
			tx.commit();
		}
	}

	@DELETE
	@Path("/{id}")
	@Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	@Transactional
	public Response deleteFavoriteById(@PathParam("id") final Integer id) {
		final String userName = getCurrentUser();
		m_logger.debug("user = {}, id = {}", userName, id);

		final Transaction tx = m_sessionFactory.getCurrentSession().beginTransaction();
		
		try {
			m_favoriteService.removeFavorite(userName, id);
			return Response.ok().build();
		} catch (final HibernateException e) {
			m_logger.warn("Failed to put favorite " + id, e);
			tx.rollback();
			return Response.serverError().build();
		} finally {
			tx.commit();
		}
	}

	@DELETE
	@Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	@Transactional
	public Response deleteFavoriteByEventId(@QueryParam("event") final String eventId) {
		final String user = getCurrentUser();
		m_logger.debug("user = {}, event = {}", user, eventId);

		final Transaction tx = m_sessionFactory.getCurrentSession().beginTransaction();
		
		try {
			m_favoriteService.removeFavorite(user, eventId);
			return Response.ok().build();
		} catch (final HibernateException e) {
			m_logger.warn("Failed to put favorite " + eventId, e);
			tx.rollback();
			return Response.serverError().build();
		} finally {
			tx.commit();
		}
	}
}
