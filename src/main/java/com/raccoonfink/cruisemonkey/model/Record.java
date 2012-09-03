package com.raccoonfink.cruisemonkey.model;

import java.util.Date;

public interface Record {
	public String getCreatedBy();
	public Date getCreatedDate();
	public String getLastModifiedBy();
	public Date getLastModifiedDate();
}
