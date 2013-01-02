package com.raccoonfink.cruisemonkey.controllers;

import java.util.Collection;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriInfo;

import org.springframework.context.annotation.Scope;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.sun.jersey.api.spring.Autowire;

@Component
@Scope("request")
@Path("/auth")
@Autowire
public class AuthRestService {
	@Context
	private UriInfo m_uriInfo;

	public AuthRestService() {}

	@GET
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	public String isAuthorized() {
		final Collection<? extends GrantedAuthority> authorities = SecurityContextHolder.getContext().getAuthentication().getAuthorities();

		for (final GrantedAuthority authority : authorities) {
			final String authorityText = authority.getAuthority();
			if ("ROLE_USER".equals(authorityText) || "ROLE_ADMIN".equals(authorityText)) {
				return "true";
			}
		}

		return "false";
	}
}
