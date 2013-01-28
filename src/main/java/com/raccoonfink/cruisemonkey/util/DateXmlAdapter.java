package com.raccoonfink.cruisemonkey.util;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

import javax.xml.bind.annotation.adapters.XmlAdapter;

public class DateXmlAdapter extends XmlAdapter<String, Date> {
	public static final DateFormat DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd hh:mma");
	static {
		DATE_FORMAT.setTimeZone(TimeZone.getTimeZone("EST"));
	}

	@Override
	public String marshal(final Date value) throws Exception {
		return DATE_FORMAT.format(value);
	}

	@Override
	public Date unmarshal(final String value) throws Exception {
		if (value != null) {
			return DATE_FORMAT.parse(value);
		}
		return null;
	}
}
