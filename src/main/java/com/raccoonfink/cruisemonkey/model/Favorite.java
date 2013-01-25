package com.raccoonfink.cruisemonkey.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;

import org.springframework.data.neo4j.annotation.GraphId;
import org.springframework.data.neo4j.annotation.Indexed;
import org.springframework.data.neo4j.annotation.NodeEntity;

@Entity
@XmlRootElement(name="favorite")
@XmlAccessorType(XmlAccessType.NONE)
@Table(name="favorites", uniqueConstraints = {
	@UniqueConstraint(columnNames={"user", "event"})
})
@NodeEntity
public class Favorite implements Serializable {
	private static final long serialVersionUID = 3L;

	@GraphId
	@XmlAttribute(name="id")
	private Long m_id;

	@Indexed(fieldName="user")
	@XmlAttribute(name="user")
	private String m_user;

	@Indexed(fieldName="event")
	@XmlAttribute(name="event")
	private String m_event;

	public Favorite() {
		super();
	}

	public Favorite(final String user, final String event) {
		m_user = user;
		m_event = event;
	}

	@Id
	@GeneratedValue
	@Column(name="id", nullable=false)
	public Long getId() {
		return m_id;
	}
	public void setId(final Long id) {
		m_id = id;
	}

	@Column(name="user")
	public String getUser() { return m_user; }
	public void setUser(final String user) { m_user = user; }

	@Column(name="event")
	public String getEvent() { return m_event; }
	public void setEvent(final String event) { m_event = event; }
	

	@Override
	public int hashCode() {
		final int prime = 59;
		int result = 1;
		result = prime * result + ((m_event == null) ? 0 : m_event.hashCode());
		result = prime * result + ((m_user == null) ? 0 : m_user.hashCode());
		return result;
	}

	@Override
	public boolean equals(final Object obj) {
		if (this == obj) return true;
		if (obj == null) return false;
		if (!(obj instanceof Favorite)) return false;
		final Favorite other = (Favorite) obj;
		if (m_event == null) {
			if (other.m_event != null) return false;
		} else if (!m_event.equals(other.m_event)) {
			return false;
		}
		if (m_user == null) {
			if (other.m_user != null) return false;
		} else if (!m_user.equals(other.m_user)) {
			return false;
		}
		return true;
	}

	@Override
	public String toString() {
		return "Favorite [id=" + m_id + ", user=" + m_user + ", event=" + m_event + "]";
	}
}
