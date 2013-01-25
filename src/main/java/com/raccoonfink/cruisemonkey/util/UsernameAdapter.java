package com.raccoonfink.cruisemonkey.util;

import javax.xml.bind.annotation.adapters.XmlAdapter;

import org.springframework.util.StringUtils;

import com.raccoonfink.cruisemonkey.dao.UserDao;
import com.raccoonfink.cruisemonkey.model.User;

public class UsernameAdapter extends XmlAdapter<String,User> {
	final UserDao m_userDao;

	public UsernameAdapter() {
		super();
		m_userDao = SpringApplicationContext.getBean("userDao", UserDao.class);
	}

	@Override
	public User unmarshal(final String username) throws Exception {
		return m_userDao.get(username.toLowerCase());
	}

	@Override
	public String marshal(final User user) throws Exception {
		return StringUtils.hasLength(user.getDisplayName())? user.getDisplayName() : user.getUsername();
	}
}
