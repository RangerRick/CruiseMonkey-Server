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

	@Id
	@Column(name="id")
	@GeneratedValue
	@XStreamAlias("id")
	@XStreamAsAttribute
	private int m_id;

	@Column(name="summary", length=100)
	@XStreamAlias("summary")
	private String m_summary;

	@Column(name="description", length=2048, nullable=true)
	@XStreamAlias("description")
	private String m_description;

	@Column(name="start")
	@XStreamAlias("start")
	private Date m_start;

	@Column(name="end")
	@XStreamAlias("end")
	private Date m_end;
	
	public Event() {
		super();
	}

	public Event(final int id, final String summary, final String description, final Date start, final Date end, final String createdBy) {
		super(createdBy);
		m_id          = id;
		m_summary     = summary;
		m_description = description;
		m_start       = start;
		m_end         = end;
	}

	public int getId() { return m_id; }
	public void setId(final int id) { m_id = id; }
		
	public String getSummary() { return m_summary; }
	public void setSummary(final String summary) { m_summary = summary; }
	
	public String getDescription() { return m_description; }
	public void setDescription(final String description) { m_description = description; }
	
	public Date getStart() { return m_start; }
	public void setStart(final Date start) { m_start = start; }
	
	public Date getEnd() { return m_end; }
	public void setEnd(final Date end) { m_end = end; }
}
