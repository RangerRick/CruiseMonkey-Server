package com.raccoonfink.cruisemonkey.security;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.util.Assert;

import com.raccoonfink.cruisemonkey.dao.UserDao;

public class DefaultUserDetailsService implements UserDetailsService, InitializingBean {
	@Autowired
	private UserDao m_userDao;

	public DefaultUserDetailsService() {
	}

	public DefaultUserDetailsService(final UserDao userDao) {
		m_userDao = userDao;
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		Assert.notNull(m_userDao);
	}

	@Override
	public UserDetails loadUserByUsername(final String username) throws UsernameNotFoundException {
		return m_userDao.get(username);
	}

}
