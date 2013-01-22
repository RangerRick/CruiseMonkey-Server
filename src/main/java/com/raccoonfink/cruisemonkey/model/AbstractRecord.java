package com.raccoonfink.cruisemonkey.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.adapters.XmlJavaTypeAdapter;

import com.raccoonfink.cruisemonkey.util.DateXmlAdapter;

@MappedSuperclass
@XmlRootElement(name="record")
@XmlAccessorType(XmlAccessType.NONE)
public abstract class AbstractRecord implements Record {
	@XmlElement(name="created-by")
	private String m_createdBy;

	@XmlElement(name="created-date")
	@XmlJavaTypeAdapter(DateXmlAdapter.class)
	private Date m_createdDate;

	public AbstractRecord() {
		final long time = System.currentTimeMillis();
		m_createdDate = new Date(time);
	}

	public AbstractRecord(final String createdBy) {
		this();
		m_createdBy = createdBy;
	}

	@Override
	@Column(name="created_by", length=64)
	public String getCreatedBy() {
		return m_createdBy;
	}
	
	public void setCreatedBy(final String username) {
		m_createdBy = username;
	}

	@Override
	@Column(name="created_date")
	public Date getCreatedDate() {
		return m_createdDate;
	}

	public void setCreatedDate(final Date created) {
		m_createdDate = created;
	}

}
