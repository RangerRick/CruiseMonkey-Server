package com.raccoonfink.cruisemonkey.server;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;

import com.raccoonfink.cruisemonkey.dao.UserDao;
import com.raccoonfink.cruisemonkey.model.User;

public class UserServiceImpl implements UserService, InitializingBean {
	@Autowired
	private UserDao m_userDao;

	public UserServiceImpl() {}
	
	public UserServiceImpl(final UserDao userDao) {
		m_userDao = userDao;
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		Assert.notNull(m_userDao);
	}

	@Override
	public User getUser(final String username) {
		return getScrubbedUser(m_userDao.get(username));
	}

	@Override
	public List<User> getUsers() {
		final List<User> users = new ArrayList<User>();
		for (final User user : m_userDao.findAll()) {
			users.add(getScrubbedUser(user));
		}
		return users;
	}

	@Override
	public void putUser(final User user) {
		m_userDao.save(user);
	}

	private User getScrubbedUser(final User realUser) {
		if (realUser == null) return null;
		return new User(realUser.getUsername(), null, realUser.getName());
	}

}
