package com.raccoonfink.cruisemonkey.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.adapters.XmlJavaTypeAdapter;

import com.raccoonfink.cruisemonkey.util.EventIdAdapter;
import com.raccoonfink.cruisemonkey.util.UsernameAdapter;

@Entity
@XmlRootElement(name="event")
@XmlAccessorType(XmlAccessType.NONE)
public class Favorite implements Serializable {
	private static final long serialVersionUID = 4414263395007635534L;

	@XmlAttribute(name="id")
	private Integer m_id;

	@XmlAttribute(name="user")
	@XmlJavaTypeAdapter(UsernameAdapter.class)
	private User m_user;

	@XmlAttribute(name="event")
	@XmlJavaTypeAdapter(EventIdAdapter.class)
	private Event m_event;

	public Favorite() {
		super();
	}

	public Favorite(final User user, final Event event) {
		m_user = user;
		m_event = event;
	}

	@Id
	@GeneratedValue
	@Column(name="id", nullable=false)
	public Integer getId() {
		return m_id;
	}
	public void setId(final Integer id) {
		m_id = id;
	}

	@OneToOne(fetch=FetchType.EAGER)
	@JoinColumn(name="userId")
	public User getUser() { return m_user; }
	public void setUser(final User user) { m_user = user; }
	
	@OneToOne(fetch=FetchType.EAGER)
	@JoinColumn(name="eventId")
	public Event getEvent() { return m_event; }
	public void setEvent(final Event event) { m_event = event; }
	
	@Override
	public int hashCode() {
		final int prime = 59;
		int result = 1;
		result = prime * result + ((m_id == null) ? 0 : m_id.hashCode());
		return result;
	}

	@Override
	public boolean equals(final Object obj) {
		if (this == obj) {
			return true;
		}
		if (obj == null) {
			return false;
		}
		if (!(obj instanceof Favorite)) {
			return false;
		}
		final Favorite other = (Favorite) obj;
		if (m_id == null) {
			if (other.m_id != null) {
				return false;
			}
		} else if (!m_id.equals(other.m_id)) {
			return false;
		}
		return true;
	}
}
