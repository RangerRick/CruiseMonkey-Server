package com.raccoonfink.cruisemonkey.util;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.xml.bind.annotation.adapters.XmlAdapter;

public class DateXmlAdapter extends XmlAdapter<String, Date> {
	final DateFormat m_format = new SimpleDateFormat("yyyy-MM-dd hh:mma");
	@Override
	public String marshal(final Date value) throws Exception {
		return m_format.format(value);
	}

	@Override
	public Date unmarshal(final String value) throws Exception {
		if (value != null) {
			return m_format.parse(value);
		}
		return null;
	}
}
