package com.raccoonfink.cruisemonkey.dao.mock;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import com.raccoonfink.cruisemonkey.UserException;
import com.raccoonfink.cruisemonkey.dao.UserDao;
import com.raccoonfink.cruisemonkey.model.User;

public class MockUserDao implements UserDao {
	final static Map<String,User> m_users = new TreeMap<String,User>();
	
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

	@Override
	public void save(final User user) throws UserException {
		if (m_users.containsKey(user.getUsername())) {
			throw new UserException("user exists");
		} else {
			m_users.put(user.getUsername(), user);
		}
	}

}
