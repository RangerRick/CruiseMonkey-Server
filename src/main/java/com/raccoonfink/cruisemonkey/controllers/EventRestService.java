package com.raccoonfink.cruisemonkey.controllers;

import java.util.Date;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
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

import com.raccoonfink.cruisemonkey.model.Event;
import com.raccoonfink.cruisemonkey.server.EventService;
import com.sun.jersey.api.core.InjectParam;
import com.sun.jersey.api.spring.Autowire;

@Component
@Scope("request")
@Path("/events")
@Autowire
public class EventRestService extends RestServiceBase implements InitializingBean {
	final Logger m_logger = LoggerFactory.getLogger(EventRestService.class);

	@InjectParam("eventService")
	@Autowired
	EventService m_eventService;

	@Context
	UriInfo m_uriInfo;

	public EventRestService() {}

	public EventRestService(@InjectParam("eventService") final EventService eventService) {
		super();
		m_eventService = eventService;
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		super.afterPropertiesSet();
		Assert.notNull(m_eventService);
	}

    @GET
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	public List<Event> getEvents(@QueryParam("start") final Date start, @QueryParam("end") final Date end, @QueryParam("user") final String userName) {
    	m_logger.debug("start = {}, end = {}, user = {}", start, end, userName);
		final List<Event> events;
		if (start != null && end != null) {
			events = m_eventService.getEventsInRange(start, end, userName);
		} else {
			events = m_eventService.getEvents(userName);
		}
		return events;
	}

	@GET
	@Path("/{id}")
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	public Event getEvent(@PathParam("id") final String id) {
		m_logger.debug("id = {}", id);
		return m_eventService.getEvent(id);
	}

	@POST
	@Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	public Response putEvent(final Event event) {
		m_logger.debug("event = {}", event);
		m_eventService.putEvent(event);
		return Response.seeOther(getRedirectUri(m_uriInfo, event.getId())).build();
	}
}
