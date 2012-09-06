package com.raccoonfink.cruisemonkey.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

import com.thoughtworks.xstream.annotations.XStreamAlias;

@MappedSuperclass
@XStreamAlias("record")
public abstract class AbstractRecord implements Record {
	@XStreamAlias("created-by")
	private String m_createdBy;

	@XStreamAlias("created-date")
	private Date m_createdDate;

	@XStreamAlias("last-modified-by")
	private String m_lastModifiedBy;

	@XStreamAlias("last-modified-date")
	private Date m_lastModifiedDate;

	public AbstractRecord() {
		m_createdDate = new Date();
		m_lastModifiedDate = new Date(m_createdDate.getTime());
	}

	public AbstractRecord(final String createdBy) {
		this();
		m_createdBy = createdBy;
		m_lastModifiedBy = createdBy;
	}

	@Override
	@Column(name="created_by", length=64)
	public String getCreatedBy() {
		return m_createdBy;
	}
	
	protected void setCreatedBy(final String username) {
		m_createdBy = username;
		if (m_lastModifiedBy == null) m_lastModifiedBy = username;
	}

	@Override
	@Column(name="created_date")
	public Date getCreatedDate() {
		return m_createdDate;
	}

	protected void setCreatedDate(final Date created) {
		m_createdDate = created;
		if (m_lastModifiedDate == null) m_lastModifiedDate = created;
	}

	@Override
	@Column(name="last_modified_by", length=64)
	public String getLastModifiedBy() {
		return m_lastModifiedBy;
	}

	protected void setLastModifiedBy(final String username) {
		m_lastModifiedBy = username;
	}

	@Override
	@Column(name="last_modified_date")
	public Date getLastModifiedDate() {
		return m_lastModifiedDate;
	}
	
	protected void setLastModifiedDate(final Date modified) {
		m_lastModifiedDate = modified;
	}

}
