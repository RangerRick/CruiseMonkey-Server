package com.raccoonfink.cruisemonkey.model;

import java.io.Serializable;
import java.util.Collections;
import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="eventCollection")
@XmlAccessorType(XmlAccessType.NONE)
public class EventCollection implements Serializable {
	private static final long serialVersionUID = 1L;

	@XmlElement(name="user")
	private User m_user = null;

	@XmlElementWrapper(name="events")
	@XmlElement(name="event")
	private List<Event> m_events = Collections.emptyList();

	@XmlElementWrapper(name="favorites")
	@XmlElement(name="favorite")
	private List<Favorite> m_favorites = Collections.emptyList();

	public User getUser() {
		return m_user;
	}
	public void setUser(final User user) {
		m_user = user;
	}

	public List<Event> getEvents() {
		return m_events;
	}
	public void setEvents(final List<Event> events) {
		m_events = events;
	}

	public List<Favorite> getFavorites() {
		return m_favorites;
	}
	public void setFavorites(final List<Favorite> favorites) {
		m_favorites = favorites;
	}
}
