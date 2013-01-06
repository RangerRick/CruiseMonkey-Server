package com.raccoonfink.cruisemonkey.server;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;

import com.raccoonfink.cruisemonkey.dao.UserDao;
import com.raccoonfink.cruisemonkey.model.User;

public class UserServiceImpl implements UserService, InitializingBean {
	final Logger m_logger = LoggerFactory.getLogger(UserServiceImpl.class);

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
		final User user = getScrubbedUser(m_userDao.get(username));
		m_logger.debug("username = {}, found user: {}", username, user);
		return user;
	}

	@Override
	public List<User> getUsers() {
		final List<User> users = new ArrayList<User>();
		for (final User user : m_userDao.findAll()) {
			users.add(getScrubbedUser(user));
		}
		m_logger.debug("returning {} users", users == null? 0 : users.size());
		return users;
	}

	@Override
	public void putUser(final User user) {
		m_logger.debug("saving user: {}", user);
		m_userDao.save(user);
	}

	private User getScrubbedUser(final User realUser) {
		if (realUser == null) return null;
		return new User(realUser.getUsername(), null, realUser.getName());
	}

}
