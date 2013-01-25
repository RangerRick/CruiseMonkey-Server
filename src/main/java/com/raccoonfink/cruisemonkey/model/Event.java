package com.raccoonfink.cruisemonkey.model;

import java.io.Serializable;
import java.util.Date;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlID;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.adapters.XmlJavaTypeAdapter;

import org.apache.commons.lang.builder.CompareToBuilder;
import org.springframework.data.neo4j.annotation.GraphId;
import org.springframework.data.neo4j.annotation.Indexed;
import org.springframework.data.neo4j.annotation.NodeEntity;

import com.raccoonfink.cruisemonkey.util.DateXmlAdapter;

@Entity
@XmlRootElement(name="event")
@XmlAccessorType(XmlAccessType.NONE)
@NodeEntity
public class Event extends AbstractRecord implements Serializable, Comparable<Event> {
	private static final long serialVersionUID = 2L;

	@Override
	public String toString() {
		return "Event [id=" + m_id + ", summary=" + m_summary
				+ ", description=" + m_description
				+ ", location=" + m_location + ", startDate="
				+ m_startDate + ", endDate=" + m_endDate + ", isPublic="
				+ m_isPublic + ", createdBy=" + getCreatedBy() + "]";
	}

	@GraphId
	private Long m_graphId;

	@Indexed(fieldName="id")
	@XmlID
	@XmlAttribute(name="id")
	private String m_id;

	@XmlElement(name="summary")
	private String m_summary;

	@XmlElement(name="description")
	private String m_description;

	@XmlElement(name="location")
	private String m_location;

	@Indexed(fieldName="start")
	@XmlElement(name="start")
	@XmlJavaTypeAdapter(DateXmlAdapter.class)
	private Date m_startDate;

	@Indexed(fieldName="end")
	@XmlElement(name="end")
	@XmlJavaTypeAdapter(DateXmlAdapter.class)
	private Date m_endDate;

	@Indexed(fieldName="isPublic")
	@XmlElement(name="isPublic")
	private Boolean m_isPublic = false;

	public Event() {
		super();
		m_id = UUID.randomUUID().toString();
	}

	public Event(final String id, String summary, final String description, final Date start, final Date end, final String createdBy) {
		this(id, summary, description, start, end, createdBy, null, false);
	}

	public Event(final String id, String summary, final String description, final Date start, final Date end, final String createdBy, final String location, final boolean isPublic) {
		super(createdBy);
		m_id          = id;
		m_summary     = summary;
		m_description = description;
		m_startDate   = start;
		m_endDate     = end;
		m_location    = location;
		m_isPublic    = isPublic;
	}

	public Long getGraphId() {
		return m_graphId;
	}
	
	public void setGraphId(final Long id) {
		m_graphId = id;
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

	@Override
	public int compareTo(final Event that) {
		return new CompareToBuilder()
			.append(this.getStartDate(), that.getStartDate())
			.append(this.getCreatedDate(), that.getCreatedDate())
			.append(this.getSummary(), that.getSummary())
			.toComparison();
	}
}
