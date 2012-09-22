package com.raccoonfink.cruisemonkey.controllers;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.View;
import org.springframework.web.servlet.view.RedirectView;

import com.raccoonfink.cruisemonkey.model.Event;
import com.raccoonfink.cruisemonkey.model.Events;
import com.raccoonfink.cruisemonkey.server.EventRestService;

@Controller
@Transactional
@RequestMapping("/events")
public class EventRestServiceController {
	@Autowired
	EventRestService m_eventRestService;

	@RequestMapping(method=RequestMethod.GET)
	@Transactional(readOnly=true)
	public Events getEvents(@RequestParam(value="start", required=false) final Date start, @RequestParam(value="end", required=false) final Date end, @RequestParam(value="user", required=false) final String userName) {
		if (start != null && end != null) {
			return new Events(m_eventRestService.getEventsInRange(start, end, userName));
		} else {
			return new Events(m_eventRestService.getEvents(userName));
		}
	}

	@RequestMapping("/{id}")
	@Transactional(readOnly=true)
	public Event getEvent(@PathVariable final String id) {
		return m_eventRestService.getEvent(id);
	}

	@RequestMapping(method=RequestMethod.POST)
	public View putEvent(@RequestBody Event event) {
		m_eventRestService.putEvent(event);
		return new RedirectView("/events/" + event.getId());
	}
}
