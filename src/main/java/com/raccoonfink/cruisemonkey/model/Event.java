package com.raccoonfink.cruisemonkey.model;

import java.io.Serializable;
import java.util.Date;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Transient;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlID;
import javax.xml.bind.annotation.XmlRootElement;

@Entity
@XmlRootElement(name="event")
@XmlAccessorType(XmlAccessType.NONE)
public class Event extends AbstractRecord implements Serializable {
	private static final long serialVersionUID = 1L;

	@Override
	public String toString() {
		return "Event [id=" + m_id + ", summary=" + m_summary
				+ ", description=" + m_description
				+ ", location=" + m_location + ", startDate="
				+ m_startDate + ", endDate=" + m_endDate + ", isPublic="
				+ m_isPublic + ", createdBy=" + getCreatedBy() + "]";
	}

	@XmlID
	@XmlAttribute(name="id")
	private String m_id;

	@XmlElement(name="summary")
	private String m_summary;

	@XmlElement(name="description")
	private String m_description;

	@XmlElement(name="location")
	private String m_location;

	@XmlElement(name="start")
	private Date m_startDate;

	@XmlElement(name="end")
	private Date m_endDate;

	@XmlElement(name="isPublic")
	private Boolean m_isPublic = false;

	public Event() {
		super();
		m_id = UUID.randomUUID().toString();
	}

	public Event(final String id, String summary, final String description, final Date start, final Date end, final String createdBy) {
		super(createdBy);
		m_id          = id;
		m_summary     = summary;
		m_description = description;
		m_startDate   = start;
		m_endDate     = end;
	}

	@Id
	@Column(name="id")
	public String getId() { return m_id; }
	public void setId(final String id) { m_id = id; }

	@Column(name="summary", length=1024)
	public String getSummary() { return m_summary; }
	public void setSummary(final String summary) { m_summary = summary; }

	@Column(name="description", length=2048, nullable=true)
	public String getDescription() { return m_description; }
	public void setDescription(final String description) { m_description = description; }

	@Column(name="location", length=1024, nullable=true)
	public String getLocation() { return m_location; }
	public void setLocation(String location) { m_location = location; }

	@Column(name="start_date")
	public Date getStartDate() { return m_startDate; }
	public void setStartDate(final Date startDate) { m_startDate = startDate; }

	@Column(name="end_date")
	public Date getEndDate() { return m_endDate; }
	public void setEndDate(final Date endDate) { m_endDate = endDate; }
	
	@Column(name="isPublic")
	public Boolean getIsPublic() { return m_isPublic; }
	public void setIsPublic(final Boolean isPublic) { m_isPublic = isPublic; }

	@XmlElement(name="startEpoch")
	@Transient
	public Long getStartEpoch() {
		return getStartDate().getTime();
	}

	public void setStartEpoch(final Long epoch) {
		setStartDate(new Date(epoch));
	}

	@XmlElement(name="endEpoch")
	@Transient
	public Long getEndEpoch() {
		return getStartDate().getTime();
	}

	public void setEndEpoch(final Long epoch) {
		setEndDate(new Date(epoch));
	}
}
