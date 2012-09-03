package com.raccoonfink.cruisemonkey.server;

import static org.junit.Assert.*;

import java.util.List;
import java.util.Map;

import org.junit.Before;
import org.junit.Test;
import org.springframework.web.servlet.ModelAndView;

import com.raccoonfink.cruisemonkey.dao.UserDao;
import com.raccoonfink.cruisemonkey.dao.mock.MockUserDao;
import com.raccoonfink.cruisemonkey.model.User;

public class UserRestServiceControllerTest {
	private UserRestServiceController m_controller;

	@Before
	public void setUp() {
		final UserDao userDao = new MockUserDao();
		final UserRestService userRestService = new MockUserRestServiceImpl(userDao);
		m_controller = new UserRestServiceController(userRestService);
	}

	@Test
	public void testGetAll() {
		final ModelAndView mav = m_controller.getAllUsers();
		final Map<String,Object> model = mav.getModel();
		
		@SuppressWarnings("unchecked")
		final List<User> users = (List<User>)model.get("org.springframework.validation.BindingResult.users");
		assertNotNull(users);
		assertEquals(1, users.size());
		assertEquals("ranger", users.get(0).getUsername());
	}
}
