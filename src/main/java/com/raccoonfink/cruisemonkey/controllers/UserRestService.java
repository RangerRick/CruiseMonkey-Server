package com.raccoonfink.cruisemonkey.controllers;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import com.raccoonfink.cruisemonkey.model.User;
import com.raccoonfink.cruisemonkey.server.UserService;
import com.sun.jersey.api.core.InjectParam;
import com.sun.jersey.api.spring.Autowire;

@Transactional
@Component
@Scope("request")
@Path("/users")
@Autowire
public class UserRestService implements InitializingBean {
	@InjectParam("userService")
	@Autowired
	UserService m_userService;

	@Context
	UriInfo m_uriInfo;

    public UserRestService() {}

	public UserRestService(@InjectParam("userService") final UserService userService) {
		m_userService = userService;
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		Assert.notNull(m_userService);
	}

	void setUserService(final UserService userService) {
		m_userService = userService;
	}

	UserService getUserService() {
		return m_userService;
	}

	@Transactional(readOnly=true)
	@GET
	@Produces({"application/xml", "application/json"})
	public List<User> getAllUsers() {
		return m_userService.getUsers();
	}
	
	@Transactional(readOnly=true)
	@GET
	@Path("/{username}")
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	public User getUser(@PathParam("username") final String username) {
		return m_userService.getUser(username);
	}

	@POST
	@Consumes(MediaType.APPLICATION_XML)
	public Response putUser(final User user) {
		System.err.println("user posted: " + user);
		m_userService.putUser(user);
		return Response.seeOther(m_uriInfo.getBaseUriBuilder().path(this.getClass(), "getUser").build(user.getUsername())).build();
	}
}
