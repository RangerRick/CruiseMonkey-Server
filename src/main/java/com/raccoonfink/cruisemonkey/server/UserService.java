package com.raccoonfink.cruisemonkey.server;

import java.util.List;

import com.raccoonfink.cruisemonkey.model.User;

public interface UserService {
	public User getUser(final String username);
	public List<User> getUsers();
	public void putUser(final User user);
}
