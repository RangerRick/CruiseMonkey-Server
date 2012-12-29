package com.raccoonfink.cruisemonkey.server;

import java.util.Collections;
import java.util.Map;

import org.codehaus.jackson.map.util.LRUMap;


public class StatusNetServiceFactory {
	private static String  s_host = null;
	private static Integer s_port = null;
	private static String  s_root = null;
	private static StatusNetServiceFactory s_instance = null;

	final Map<String, StatusNetService> m_services = Collections.synchronizedMap(new LRUMap<String, StatusNetService>(0, 200));

	protected StatusNetServiceFactory() {}

	public static synchronized StatusNetServiceFactory getInstance() {
		if (s_host == null || s_port == null) {
			throw new IllegalStateException("You must set a host and port!");
		}
		if (s_instance == null) {
			s_instance = new StatusNetServiceFactory();
		}
		return new StatusNetServiceFactory();
	}

	public static synchronized void setHost(final String host) {
		s_host     = host;
		s_instance = null;
	}

	public static synchronized void setPort(final Integer port) {
		s_port     = port;
		s_instance = null;
	}

	public static synchronized void setRoot(final String root) {
		s_root     = root;
		s_instance = null;
	}

	public StatusNetService getService(final String username, final String password) {
		if (m_services.containsKey(username)) {
			final StatusNetService statusNetService = m_services.get(username);
			if (password == statusNetService.getPassword()) {
				return statusNetService;
			}
		}

		final StatusNetService statusNetService = new StatusNetService(s_host, s_port, s_root, username, password);
		m_services.put(username, statusNetService);
		return statusNetService;
	}
}
