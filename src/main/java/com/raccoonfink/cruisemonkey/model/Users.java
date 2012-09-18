package com.raccoonfink.cruisemonkey.model;

import java.util.ArrayList;
import java.util.Collection;

import com.thoughtworks.xstream.annotations.XStreamAlias;

@XStreamAlias("users")
public class Users extends ArrayList<User> {
	private static final long serialVersionUID = -7572598560006224755L;

	public Users() {
		super();
	}

	public Users(final Collection<User> events) {
		super(events);
	}

}
