package com.raccoonfink.cruisemonkey.server;

import java.util.List;

import org.springframework.transaction.annotation.Transactional;

import com.raccoonfink.cruisemonkey.model.User;

@Transactional(readOnly=true)
public interface UserService {
	public User getUser(final String username);
	public List<User> getUsers();
	@Transactional
	public void putUser(final User user);
}
