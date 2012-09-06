package com.raccoonfink.cruisemonkey.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamAsAttribute;

@Entity
@XStreamAlias("event")
public class Event extends AbstractRecord implements Serializable {
	private static final long serialVersionUID = 1L;

	@XStreamAlias("id")
	@XStreamAsAttribute
	private Integer m_id;

	@XStreamAlias("summary")
	private String m_summary;

	@XStreamAlias("description")
	private String m_description;

	@XStreamAlias("start")
	private Date m_startDate;

	@XStreamAlias("end")
	private Date m_endDate;

	public Event() {
		super();
	}

	public Event(final Integer id, final String summary, final String description, final Date start, final Date end, final String createdBy) {
		super(createdBy);
		m_id          = id;
		m_summary     = summary;
		m_description = description;
		m_startDate   = start;
		m_endDate     = end;
	}

	@Id
	@Column(name="id")
	@GeneratedValue
	public Integer getId() { return m_id; }
	public void setId(final Integer id) { m_id = id; }

	@Column(name="summary", length=100)
	public String getSummary() { return m_summary; }
	public void setSummary(final String summary) { m_summary = summary; }

	@Column(name="description", length=2048, nullable=true)
	public String getDescription() { return m_description; }
	public void setDescription(final String description) { m_description = description; }

	@Column(name="start_date")
	public Date getStartDate() { return m_startDate; }
	public void setStartDate(final Date startDate) { m_startDate = startDate; }

	@Column(name="end_date")
	public Date getEndDate() { return m_endDate; }
	public void setEndDate(final Date endDate) { m_endDate = endDate; }
}
