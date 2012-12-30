package com.raccoonfink.cruisemonkey.controllers;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriInfo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import com.raccoonfink.cruisemonkey.dao.FavoriteDao;
import com.raccoonfink.cruisemonkey.dao.UserDao;
import com.raccoonfink.cruisemonkey.model.Event;
import com.raccoonfink.cruisemonkey.model.EventCollection;
import com.raccoonfink.cruisemonkey.server.EventService;
import com.sun.jersey.api.core.InjectParam;
import com.sun.jersey.api.spring.Autowire;

@Transactional
@Component
@Scope("request")
@Path("/cruisemonkey")
@Autowire
public class ApplicationRestService extends RestServiceBase implements InitializingBean {
	final Logger m_logger = LoggerFactory.getLogger(ApplicationRestService.class);

	@InjectParam("eventService")
	@Autowired
	EventService m_eventService;

	@InjectParam("favoriteDao")
	@Autowired
	FavoriteDao m_favoriteDao;

	@InjectParam("userDao")
	@Autowired
	UserDao m_userDao;

	@Context
	UriInfo m_uriInfo;

	public ApplicationRestService() {}

	public ApplicationRestService(@InjectParam("eventService") final EventService eventService, @InjectParam("favoriteDao") final FavoriteDao favoriteDao, @InjectParam("userDao") final UserDao userDao) {
		m_eventService = eventService;
		m_favoriteDao = favoriteDao;
		m_userDao = userDao;
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		super.afterPropertiesSet();
		Assert.notNull(m_eventService);
		Assert.notNull(m_favoriteDao);
		Assert.notNull(m_userDao);
	}

	@Transactional(readOnly=true)
    @GET
    @Path("/events")
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	public EventCollection getEventCollection(@QueryParam("start") final Date start, @QueryParam("end") final Date end) {
		final String userName = getCurrentUser();
		m_logger.debug("start = {}, end = {}, user = {}", start, end, userName);
		final List<Event> events = new ArrayList<Event>();
		if (start != null && end != null) {
			events.addAll(m_eventService.getEventsInRange(start, end, userName));
			events.addAll(m_eventService.getEventsInRange(start, end, "google"));
		} else {
			events.addAll(m_eventService.getEvents(userName));
			events.addAll(m_eventService.getEvents("google"));
		}
		m_logger.debug("{} events found", events == null? 0 : events.size());

		final EventCollection collection = new EventCollection();
		collection.setUser(m_userDao.get(userName));
		collection.setEvents(events);
		collection.setFavorites(m_favoriteDao.findByUser(userName));

		return collection;
	}
}
