package com.raccoonfink.cruisemonkey.dao.mock;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.raccoonfink.cruisemonkey.dao.UserDao;
import com.raccoonfink.cruisemonkey.model.User;

public class MockUserDao implements UserDao {
	final static Map<String,User> m_users = new HashMap<String,User>();
	
	static {
		m_users.put("ranger", new User("ranger", "ranger", "Benjamin Reed"));
	}

	@Override
	public List<User> findAll() {
		return new ArrayList<User>(m_users.values());
	}

	@Override
	public User get(final String username) {
		return m_users.get(username);
	}

}
