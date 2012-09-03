package com.raccoonfink.cruisemonkey.model;

import java.util.Date;

public class AbstractRecord implements Record {
	private String m_createdBy;
	private Date m_createdDate;
	private String m_lastModifiedBy;
	private Date m_lastModifiedDate;

	public AbstractRecord() {
		final Date now = new Date();
		m_createdDate = now;
		m_lastModifiedDate = now;
	}

	public AbstractRecord(final String createdBy) {
		this();
		m_createdBy = createdBy;
		m_lastModifiedBy = createdBy;
	}

	@Override
	public String getCreatedBy() {
		return m_createdBy;
	}
	
	protected void setCreatedBy(final String username) {
		m_createdBy = username;
		if (m_lastModifiedBy == null) m_lastModifiedBy = username;
	}

	@Override
	public Date getCreatedDate() {
		return m_createdDate;
	}

	protected void setCreatedDate(final Date created) {
		m_createdDate = created;
		if (m_lastModifiedDate == null) m_lastModifiedDate = created;
	}

	@Override
	public String getLastModifiedBy() {
		return m_lastModifiedBy;
	}

	protected void setLastModifiedBy(final String username) {
		m_lastModifiedBy = username;
	}

	@Override
	public Date getLastModifiedDate() {
		return m_lastModifiedDate;
	}
	
	protected void setLastModifiedDate(final Date modified) {
		m_lastModifiedDate = modified;
	}

}
