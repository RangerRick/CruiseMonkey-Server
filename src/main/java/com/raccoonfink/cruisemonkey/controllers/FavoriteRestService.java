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

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import com.raccoonfink.cruisemonkey.dao.EventDao;
import com.raccoonfink.cruisemonkey.dao.FavoriteDao;
import com.raccoonfink.cruisemonkey.dao.UserDao;
import com.raccoonfink.cruisemonkey.model.Event;
import com.raccoonfink.cruisemonkey.model.Favorite;
import com.raccoonfink.cruisemonkey.model.User;
import com.sun.jersey.api.core.InjectParam;
import com.sun.jersey.api.spring.Autowire;

@Transactional
@Component
@Scope("request")
@Path("/favorites")
@Autowire
public class FavoriteRestService extends RestServiceBase implements InitializingBean {
	@InjectParam("favoriteDao")
	@Autowired
	FavoriteDao m_favoriteDao;

	@InjectParam("eventDao")
	@Autowired
	EventDao m_eventDao;

	@InjectParam("userDao")
	@Autowired
	UserDao m_userDao;

	@Context
	UriInfo m_uriInfo;

	public FavoriteRestService() {}

	public FavoriteRestService(
			@InjectParam("favoriteDao") final FavoriteDao favoriteDao,
			@InjectParam("eventDao") final EventDao eventDao,
			@InjectParam("userDao") final UserDao userDao
			) {
		m_favoriteDao = favoriteDao;
		m_eventDao = eventDao;
		m_userDao = userDao;
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		super.afterPropertiesSet();
		Assert.notNull(m_favoriteDao);
		Assert.notNull(m_eventDao);
	}

	@Transactional(readOnly=true)
    @GET
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	public List<Favorite> getFavorites(@QueryParam("user") final String userName) {
		return m_favoriteDao.findByUser(userName == null? getCurrentUser() : userName);
	}

	@Transactional(readOnly=true)
	@GET
	@Path("/{id}")
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	public Favorite getFavorite(@PathParam("id") final Integer id) {
		return m_favoriteDao.get(id);
	}

	@PUT
	public Response putFavorite(@QueryParam("event") final String eventId) {
		final String userName = getCurrentUser();

		Favorite favorite = m_favoriteDao.findByUserAndEventId(userName, eventId);
		if (favorite == null) {
			final User user = m_userDao.get(userName);
			final Event event = m_eventDao.get(eventId);
			if (event != null && user != null) {
				favorite = new Favorite(user, event);
			}
		}

		if (favorite == null) {
			return Response.serverError().build();
		} else {
			m_favoriteDao.save(favorite);
			return Response.seeOther(m_uriInfo.getBaseUriBuilder().path(this.getClass(), "getFavorite").build(favorite.getId())).build();
		}
	}

	@POST
	@Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	public Response postFavorite(final Favorite favorite) {
		m_favoriteDao.save(favorite);
		return Response.seeOther(m_uriInfo.getBaseUriBuilder().path(this.getClass(), "getFavorite").build(favorite.getId())).build();
	}

	@DELETE
	@Path("/{id}")
	@Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	public Response deleteFavorite(@PathParam("id") final Integer id) {
		final Favorite favorite = m_favoriteDao.get(id);
		if (favorite != null) m_favoriteDao.delete(favorite);
		return Response.ok().build();
	}

}
