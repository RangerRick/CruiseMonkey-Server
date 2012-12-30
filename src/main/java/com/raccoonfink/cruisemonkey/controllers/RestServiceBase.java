package com.raccoonfink.cruisemonkey.controllers;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

public class RestServiceBase implements InitializingBean {
	public RestServiceBase() {
	}

	@Override
	public void afterPropertiesSet() throws Exception {
	}

	protected String getCurrentUser() {
		final Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if (principal instanceof UserDetails) {
			return ((UserDetails)principal).getUsername();
		}
		return null;
	}
}
