package com.raccoonfink.cruisemonkey.dao;

import java.util.List;

import com.raccoonfink.cruisemonkey.model.User;

public interface UserDao {
	public List<User> findAll();
	public User get(final String username);
	public void save(final User user);
}
