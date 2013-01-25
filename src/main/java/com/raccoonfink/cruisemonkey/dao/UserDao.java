package com.raccoonfink.cruisemonkey.dao;

import com.raccoonfink.cruisemonkey.model.User;

public interface UserDao extends Dao<User,Long> {
	public User get(final String id);
}
