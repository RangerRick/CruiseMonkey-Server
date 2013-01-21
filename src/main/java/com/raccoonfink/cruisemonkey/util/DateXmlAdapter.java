package com.raccoonfink.cruisemonkey.util;

import java.util.Date;

import javax.xml.bind.annotation.adapters.XmlAdapter;

public class DateXmlAdapter extends XmlAdapter<Long, Date> {

	@Override
	public Long marshal(final Date value) throws Exception {
		return value.getTime();
	}

	@Override
	public Date unmarshal(final Long value) throws Exception {
		if (value != null) {
			return new Date(value);
		}
		return null;
	}
}
