package com.raccoonfink.cruisemonkey.server;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;

import com.raccoonfink.cruisemonkey.dao.UserDao;
import com.raccoonfink.cruisemonkey.model.User;

public class UserInitializer implements InitializingBean {
	@Autowired
	UserDao m_userDao;

	@Override
	public void afterPropertiesSet() throws Exception {
		Assert.notNull(m_userDao);
		
		User user = m_userDao.get("admin");
		if (user == null) {
			user = new User("admin", "admin", "Administrator");
			m_userDao.save(user);
		} else {
			System.err.println("already have a user: " + user);
		}
	}

}
