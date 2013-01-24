package com.raccoonfink.cruisemonkey.security;

import org.hibernate.HibernateException;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.util.Assert;

import com.raccoonfink.cruisemonkey.dao.UserDao;

public class DefaultUserDetailsService implements UserDetailsService, InitializingBean {
	final Logger m_logger = LoggerFactory.getLogger(DefaultUserDetailsService.class);
	@Autowired
	private UserDao m_userDao;
	
	@Autowired
	private SessionFactory m_sessionFactory;

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
    	final Transaction tx = m_sessionFactory.getCurrentSession().beginTransaction();

    	try {
    		return m_userDao.get(username);
    	} catch (final HibernateException e) {
    		m_logger.warn("Failed to get user " + username, e);
    		tx.rollback();
    		return null;
    	} finally {
    		tx.commit();
    	}
	}

}
