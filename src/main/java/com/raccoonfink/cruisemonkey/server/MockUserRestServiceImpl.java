package com.raccoonfink.cruisemonkey.server;

import java.util.List;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;

import com.google.common.collect.Lists;
import com.raccoonfink.cruisemonkey.dao.UserDao;
import com.raccoonfink.cruisemonkey.model.User;

public class MockUserRestServiceImpl implements UserRestService, InitializingBean {
	@Autowired
	private UserDao m_userDao;

	@Override
	public void afterPropertiesSet() throws Exception {
		Assert.notNull(m_userDao);
	}

	@Override
	public User getUser(final String username) {
		return m_userDao.get(username);
	}

	@Override
	public List<User> getUsers() {
		return Lists.newArrayList(m_userDao.findAll());
	}

}
