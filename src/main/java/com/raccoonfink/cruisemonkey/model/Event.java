package com.raccoonfink.cruisemonkey.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import org.hibernate.annotations.GenericGenerator;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamAsAttribute;

@Entity
@XStreamAlias("event")
public class Event extends AbstractRecord implements Serializable {
	private static final long serialVersionUID = 1L;

	@XStreamAlias("id")
	@XStreamAsAttribute
	private String m_id;

	@XStreamAlias("description")
	private String m_description;

	@XStreamAlias("start")
	private Date m_startDate;

	@XStreamAlias("end")
	private Date m_endDate;

	@XStreamAlias("public")
	@XStreamAsAttribute
	private Boolean m_isPublic = false;

	public Event() {
		super();
	}

	public Event(final String id, final String description, final Date start, final Date end, final String createdBy) {
		super(createdBy);
		m_id          = id;
		m_description = description;
		m_startDate   = start;
		m_endDate     = end;
	}

	@Id
	@Column(name="id")
	@GeneratedValue(generator="system-uuid")
	@GenericGenerator(name="system-uuid", strategy="uuid")
	public String getId() { return m_id; }
	public void setId(final String id) { m_id = id; }

	@Column(name="description", length=2048, nullable=true)
	public String getDescription() { return m_description; }
	public void setDescription(final String description) { m_description = description; }

	@Column(name="start_date")
	public Date getStartDate() { return m_startDate; }
	public void setStartDate(final Date startDate) { m_startDate = startDate; }

	@Column(name="end_date")
	public Date getEndDate() { return m_endDate; }
	public void setEndDate(final Date endDate) { m_endDate = endDate; }
	
	@Column(name="public")
	public Boolean getIsPublic() { return m_isPublic; }
	public void setIsPublic(final Boolean isPublic) { m_isPublic = isPublic; }
}
