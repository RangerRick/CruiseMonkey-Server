package com.raccoonfink.cruisemonkey.model;

import java.io.Serializable;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlID;

public class CalendarGroup extends AbstractRecord implements Serializable {
	private static final long serialVersionUID = 1L;

	@XmlID
	@XmlAttribute(name="id")
	private String m_id;

	@XmlElement(name="events")
	private Events m_events = new Events();
}
