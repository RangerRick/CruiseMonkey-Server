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
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
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
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	public List<Favorite> getFavorites(@QueryParam("user") final String userName) {
		final String user = userName == null? getCurrentUser() : userName;
		m_logger.debug("user = {}", user);
		return m_favoriteService.getFavorites(user);
	}

	@GET
	@Path("/{id}")
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	public Favorite getFavorite(@PathParam("id") final Integer id) {
		final String user = getCurrentUser();
		m_logger.debug("user = {}, id = {}", user, id);
		return m_favoriteService.getFavorite(user, id);
	}

	@PUT
	public Response putFavorite(@QueryParam("event") final String eventId) {
		final String userName = getCurrentUser();

		m_logger.debug("user = {}, event = {}", userName, eventId);
		if (userName == null || eventId == null) {
			return Response.serverError().build();
		}

		final Favorite favorite = m_favoriteService.addFavorite(userName, eventId);
		m_logger.debug("created: {}", favorite);
		return Response.seeOther(getRedirectUri(m_uriInfo, favorite.getId())).build();
	}

	@POST
	@Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	public Response postFavorite(final Favorite favorite) {
		final String userName = getCurrentUser();
		
		if (userName != favorite.getUser()) {
			throw new IllegalArgumentException("You cannot create favorites for other users!");
		}

		final Favorite saved = m_favoriteService.addFavorite(favorite);
		m_logger.debug("saved favorite = {}", favorite);
		return Response.seeOther(getRedirectUri(m_uriInfo, saved.getId())).build();
	}

	@DELETE
	@Path("/{id}")
	@Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	public Response deleteFavoriteById(@PathParam("id") final Integer id) {
		final String userName = getCurrentUser();
		m_logger.debug("user = {}, id = {}", userName, id);
		m_favoriteService.removeFavorite(userName, id);
		return Response.ok().build();
	}

	@DELETE
	@Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	public Response deleteFavoriteByEventId(@QueryParam("event") final String eventId) {
		final String user = getCurrentUser();
		m_logger.debug("user = {}, event = {}", user, eventId);
		m_favoriteService.removeFavorite(user, eventId);
		return Response.ok().build();
	}
}
