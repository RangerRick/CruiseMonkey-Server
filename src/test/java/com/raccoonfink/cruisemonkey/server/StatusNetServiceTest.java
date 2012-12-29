package com.raccoonfink.cruisemonkey.server;



import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import org.junit.Test;

import com.raccoonfink.cruisemonkey.model.User;

public class StatusNetServiceTest {

	private static final String HOST     = System.getProperty("statusNetHost", "identi.ca");
	private static final int    PORT     = Integer.valueOf(System.getProperty("statusNetPort", "80"));
	private static final String PATH     = System.getProperty("statusNetRoot", "");
	private static final String USERNAME = System.getProperty("statusNetUser", "");
	private static final String PASSWORD = System.getProperty("statusNetPassword", "");

	@Test
	public void testHttpAuth() throws Exception {
		new StatusNetService(HOST, PORT, PATH, USERNAME, PASSWORD).authorize();
	}

	@Test(expected=AuthorizationFailureException.class)
	public void testHttpAuthFailure() throws Exception {
		new StatusNetService(HOST, 80, PATH, USERNAME, "aoeuaoeu").authorize();
	}

	@Test
	public void testUser() throws Exception {
		final StatusNetService service = new StatusNetService(HOST, PORT, PATH, USERNAME, PASSWORD).authorize();
		final User user = service.getUser();
		assertNotNull(user);
		assertEquals(USERNAME, user.getUsername());
	}
}
