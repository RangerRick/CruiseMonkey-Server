package com.raccoonfink.cruisemonkey.server;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.raccoonfink.cruisemonkey.model.Event;

@Controller
public class EventRestServiceController {
	@Autowired
	EventRestService m_eventRestService;

	@RequestMapping(value="/events/list")
	public ModelAndView getUsers(@RequestParam(value="start", required=false) final Date start, @RequestParam(value="end", required=false) final Date end) {
		final List<Event> events;
		if (start != null && end != null) {
			events = m_eventRestService.getEventsInRange(start, end);
		} else {
			events = m_eventRestService.getEvents();
		}
		final ModelAndView mav = new ModelAndView("xmlView", BindingResult.MODEL_KEY_PREFIX + "events", events);
		return mav;
	}
	
	@RequestMapping(value="/events/{id}")
	public ModelAndView getUser(@PathVariable final int id) {
		final Event event = m_eventRestService.getEvent(id);
		final ModelAndView mav = new ModelAndView("xmlView", BindingResult.MODEL_KEY_PREFIX + "event", event);
		return mav;
	}
}
