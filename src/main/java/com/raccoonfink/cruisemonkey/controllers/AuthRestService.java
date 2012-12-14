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

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import com.raccoonfink.cruisemonkey.model.Event;
import com.raccoonfink.cruisemonkey.server.AuthService;
import com.raccoonfink.cruisemonkey.server.EventService;
import com.sun.jersey.api.core.InjectParam;
import com.sun.jersey.api.spring.Autowire;

@Transactional
@Component
@Scope("request")
@Path("/auth")
@Autowire
public class AuthRestService implements InitializingBean {
	@InjectParam("authService")
	@Autowired
	AuthService m_authService;

	@Context
	UriInfo m_uriInfo;

	public AuthRestService() {}

	public AuthRestService(@InjectParam("authService") final AuthService authService) {
		m_authService = authService;
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		Assert.notNull(m_authService);
	}

	/*
	@Transactional(readOnly=true)
    @GET
	@Produces({"application/xml", "application/json"})
	public List<Event> getEvents(@QueryParam("start") final Date start, @QueryParam("end") final Date end, @QueryParam("user") final String userName) {
		if (start != null && end != null) {
			return m_eventService.getEventsInRange(start, end, userName);
		} else {
			return m_eventService.getEvents(userName);
		}
	}

	@Transactional(readOnly=true)
	@GET
	@Path("/{id}")
	@Produces({"application/xml", "application/json"})
	public Event getEvent(@PathParam("id") final String id) {
		return m_eventService.getEvent(id);
	}

	@POST
	@Consumes(MediaType.APPLICATION_XML)
	public Response putEvent(final Event event) {
		m_eventService.putEvent(event);
		return Response.seeOther(m_uriInfo.getBaseUriBuilder().path(this.getClass(), "getEvent").build(event.getId())).build();
	}
	*/
}
