package com.raccoonfink.cruisemonkey.server;

import java.util.UUID;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import com.raccoonfink.cruisemonkey.dao.UserDao;
import com.raccoonfink.cruisemonkey.model.User;

@Transactional
public class UserInitializer implements InitializingBean {
	@Autowired
	UserDao m_userDao;

	@Override
	public void afterPropertiesSet() throws Exception {
		Assert.notNull(m_userDao);

		User user = m_userDao.get("official");
		if (user == null) {
			user = new User("official", UUID.randomUUID().toString(), "Official Calendar");
			m_userDao.save(user);
		} else {
			System.err.println("already have a user: " + user);
		}
	}

}
