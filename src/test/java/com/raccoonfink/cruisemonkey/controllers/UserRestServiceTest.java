package com.raccoonfink.cruisemonkey.controllers;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.util.List;

import org.junit.Before;
import org.junit.Test;

import com.raccoonfink.cruisemonkey.dao.UserDao;
import com.raccoonfink.cruisemonkey.dao.mock.MockUserDao;
import com.raccoonfink.cruisemonkey.model.User;
import com.raccoonfink.cruisemonkey.server.UserServiceImpl;
import com.raccoonfink.cruisemonkey.server.UserService;

public class UserRestServiceTest {
	private UserRestService m_restService;

	@Before
	public void setUp() {
		final UserDao userDao = new MockUserDao();
		final UserService userService = new UserServiceImpl(userDao);
		m_restService = new UserRestService(userService);
	}

	@Test
	public void testGetAll() {
		final List<User> users = m_restService.getAllUsers();
		assertNotNull(users);
		assertEquals(1, users.size());
		assertEquals("ranger", users.get(0).getUsername());
	}
}
