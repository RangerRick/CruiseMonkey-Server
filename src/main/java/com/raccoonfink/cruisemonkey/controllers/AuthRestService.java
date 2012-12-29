package com.raccoonfink.cruisemonkey.controllers;

import java.util.Collection;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.sun.jersey.api.spring.Autowire;

@Transactional
@Component
@Scope("request")
@Path("/auth")
@Autowire
public class AuthRestService implements InitializingBean {
	@Context
	private UriInfo m_uriInfo;

	@Autowired
	private AuthenticationManager m_authenticationManager;

	public AuthRestService() {}

	@Override
	public void afterPropertiesSet() throws Exception {
	}

	@GET
	@Produces({"application/xml", "application/json"})
	public boolean isAuthorized(HttpServletRequest request) {
		final Collection<? extends GrantedAuthority> authorities = SecurityContextHolder.getContext().getAuthentication().getAuthorities();

		for (final GrantedAuthority authority : authorities) {
			authority.getAuthority();
		}

		return true;
	}
}
