package com.raccoonfink.cruisemonkey.server;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.util.Assert;

import com.raccoonfink.cruisemonkey.dao.UserDao;
import com.raccoonfink.cruisemonkey.model.User;

public class MockUserRestServiceImpl implements UserRestService, InitializingBean {
	private UserDao m_userDao;

	public void setUserDao(final UserDao userDao) {
		m_userDao = userDao;
	}
	
	public UserDao getUserDao() {
		return m_userDao;
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

	private User getScrubbedUser(final User realUser) {
		return new User(realUser.getUsername(), null, realUser.getName());
	}

}
