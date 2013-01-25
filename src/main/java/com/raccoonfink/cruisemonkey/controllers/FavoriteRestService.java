package com.raccoonfink.cruisemonkey.controllers;

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
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriInfo;

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

	@Context
	UriInfo m_uriInfo;

	public FavoriteRestService() {}

	public FavoriteRestService(
			@InjectParam("favoriteDao") final FavoriteDao favoriteDao,
			@InjectParam("eventDao") final EventDao eventDao,
			@InjectParam("userDao") final UserDao userDao,
			@InjectParam("userDao") final FavoriteService favoriteService
			) {
		m_favoriteDao = favoriteDao;
		m_eventDao = eventDao;
		m_userDao = userDao;
		m_favoriteService = favoriteService;
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		super.afterPropertiesSet();
		Assert.notNull(m_favoriteDao);
		Assert.notNull(m_eventDao);
		Assert.notNull(m_userDao);
		Assert.notNull(m_favoriteService);
	}

    @GET
	@Produces(MediaType.APPLICATION_JSON)
	@Transactional(readOnly=true)
    public List<Favorite> getFavorites() {
		final String user = getCurrentUser();
		m_logger.debug("user = {}", user);

		return m_favoriteService.getFavorites(user);
    }

    @GET
	@Produces(MediaType.APPLICATION_JSON)
	@Transactional(readOnly=true)
    @Path("/{id}")
    public Favorite getFavorite(final Long id) {
		final String user = getCurrentUser();
		m_logger.debug("user = {}", user);

		return m_favoriteService.getFavorite(user, id);
    }

	@PUT
	@Transactional
	public void putFavorite(@QueryParam("event") final String eventId) {
		final String userName = getCurrentUser();

		m_logger.debug("user = {}, event = {}", userName, eventId);
		if (userName == null) {
			throw new WebApplicationException(new IllegalStateException("Unable to determine current user!"), Status.FORBIDDEN);
		}
		if (eventId == null) {
			throw new WebApplicationException(new IllegalArgumentException("Event ID not specified."), Status.BAD_REQUEST);
		}

		m_favoriteService.addFavorite(userName, eventId);
		final Favorite favorite = m_favoriteService.getFavorite(userName, eventId);
		m_logger.debug("created: {}", favorite);
	}

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Transactional
	public void postFavorite(final Favorite favorite) {
		final String userName = getCurrentUser();
		
		if (!userName.equalsIgnoreCase(favorite.getUser())) {
			throw new WebApplicationException(new IllegalArgumentException("You cannot create favorites for other users!"), Status.FORBIDDEN);
		}

		m_favoriteService.addFavorite(favorite);
		final Favorite saved = m_favoriteService.getFavorite(favorite.getUser(), favorite.getEvent());
		m_logger.debug("saved favorite = {}", saved);
	}

	@DELETE
	@Path("/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Transactional
	public void deleteFavoriteById(@PathParam("id") final Long id) {
		final String userName = getCurrentUser();
		m_logger.debug("user = {}, id = {}", userName, id);

		m_favoriteService.removeFavorite(userName, id);
	}

	@DELETE
	@Consumes(MediaType.APPLICATION_JSON)
	@Transactional
	public void deleteFavoriteByEventId(@QueryParam("event") final String eventId) {
		final String user = getCurrentUser();
		m_logger.debug("user = {}, event = {}", user, eventId);

		m_favoriteService.removeFavorite(user, eventId);
		m_logger.debug("deleted favorite = {}, {}", user, eventId);
	}
}
