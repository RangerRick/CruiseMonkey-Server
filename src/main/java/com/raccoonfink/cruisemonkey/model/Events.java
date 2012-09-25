package com.raccoonfink.cruisemonkey.model;

import java.util.ArrayList;
import java.util.Collection;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="events")
public class Events extends ArrayList<Event> {
	private static final long serialVersionUID = 4144250605158398689L;

	public Events() {
		super();
	}

	public Events(final Collection<Event> events) {
		super(events);
	}

}
