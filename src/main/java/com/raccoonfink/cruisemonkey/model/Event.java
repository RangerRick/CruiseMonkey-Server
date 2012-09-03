package com.raccoonfink.cruisemonkey.model;

import java.util.Date;

public class Event extends AbstractRecord {
	private String m_summary;
	private String m_description;
	private Date m_start;
	private Date m_end;
	
	public String getSummary() { return m_summary; }
	public void setSummary(final String summary) { m_summary = summary; }
	
	public String getDescription() { return m_description; }
	public void setDescription(final String description) { m_description = description; }
	
	public Date getStart() { return m_start; }
	public void setStart(final Date start) { m_start = start; }
	
	public Date getEnd() { return m_end; }
	public void setEnd(final Date end) { m_end = end; }
}
