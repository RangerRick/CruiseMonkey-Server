package com.raccoonfink.cruisemonkey.controllers;

import java.text.ParseException;
import java.util.Date;
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
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import com.raccoonfink.cruisemonkey.model.Event;
import com.raccoonfink.cruisemonkey.server.EventService;
import com.raccoonfink.cruisemonkey.util.DateXmlAdapter;
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
	@Transactional(readOnly=true)
	public List<Event> getEvents(@QueryParam("start") final Date start, @QueryParam("end") final Date end, @QueryParam("user") final String userName) {
    	m_logger.debug("getEvents: start = {}, end = {}, user = {}", start, end, userName);
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
	@Transactional(readOnly=true)
	public Event getEvent(@PathParam("id") final String id) {
		m_logger.debug("getEvent: id = {}", id);
		return m_eventService.getEvent(id);
	}

	/*
	 * 				builder.setParameter("createdBy", CM3.getNetworkState().getUsername());
				builder.setParameter("summary", summary.getText());
				builder.setParameter("description", summary.getText());
				builder.setParameter("start", startString);
				builder.setParameter("end", endString);
				builder.setParameter("location", location.getText());
				builder.setParameter("isPublic", isPublic.getValue().toString());

	 */
	@PUT
	@Path("/{id}")
	@Transactional
	public Response putEvent(
		@PathParam("id") final String eventId,
		@QueryParam("summary") final String summary,
		@QueryParam("description") final String description,
		@QueryParam("start") final String start,
		@QueryParam("end") final String end,
		@QueryParam("location") final String location,
		@QueryParam("isPublic") final Boolean isPublic
	) {
		final String userName = getCurrentUser();
		boolean modified = false;

		m_logger.debug("putEvent: user = {}, event = {}, isPublic = {}", userName, eventId, isPublic);
		if (userName == null || eventId == null) {
			return Response.serverError().build();
		}

		final Event event = m_eventService.getEvent(eventId);
		if (event == null) {
			m_logger.debug("putEvent: Trying to modify an event that's not in the database!");
			return Response.notModified().build();
		} else {
			if (!event.getCreatedBy().equals(userName)) {
				m_logger.debug("putEvent: createdBy = {}, username = {}", event.getCreatedBy(), userName);
				throw new WebApplicationException(401);
			}
			
			if (summary != null) {
				event.setSummary(summary);
				modified = true;
			}
			if (description != null) {
				event.setDescription(description);
				modified = true;
			}
			if (start != null) {
				try {
					event.setStartDate(DateXmlAdapter.DATE_FORMAT.parse(start));
					modified = true;
				} catch (final ParseException e) {
					throw new WebApplicationException(e);
				}
			}
			if (end != null) {
				try {
					event.setEndDate(DateXmlAdapter.DATE_FORMAT.parse(end));
					modified = true;
				} catch (final ParseException e) {
					throw new WebApplicationException(e);
				}
			}
			if (location != null) {
				event.setLocation(location);
				modified = true;
			}
			if (isPublic != null) {
				event.setIsPublic(isPublic);
				modified = true;
			}

			if (!modified) {
				return Response.notModified().build();
			}

			m_eventService.putEvent(event);
			return Response.seeOther(getRedirectUri(m_uriInfo)).build();
		}
	}

	@DELETE
	@Path("/{id}")
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	@Transactional(readOnly=true)
	public void deleteEvent(@PathParam("id") final String id) {
		m_logger.debug("deleteEvent: id = {}", id);
		final String user = getCurrentUser();
		final Event event = m_eventService.getEvent(id);
		if (event == null) {
			m_logger.debug("deleteEvent: Trying to delete an event that's not in the database!");
		} else {
			if (!event.getCreatedBy().equals(user)) {
				m_logger.debug("deleteEvent: createdBy = {}, username = {}", event.getCreatedBy(), user);
				throw new WebApplicationException(401);
			}
			m_eventService.deleteEvent(event);
		}
	}

	@POST
	@Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	@Transactional
	public Response putEvent(final Event event) {
		m_logger.debug("putEvent: event = {}", event);
		m_eventService.putEvent(event, getCurrentUser());
		return Response.seeOther(getRedirectUri(m_uriInfo, event.getId())).build();
	}
}
