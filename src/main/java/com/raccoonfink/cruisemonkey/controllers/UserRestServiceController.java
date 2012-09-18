package com.raccoonfink.cruisemonkey.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.raccoonfink.cruisemonkey.model.User;
import com.raccoonfink.cruisemonkey.server.UserRestService;

@Controller
@Transactional
@RequestMapping("/users")
public class UserRestServiceController {
	@Autowired
	UserRestService m_userRestService;

	public UserRestServiceController() {}

	public UserRestServiceController(final UserRestService userRestService) {
		m_userRestService = userRestService;
	}

	void setUserRestService(final UserRestService userRestService) {
		m_userRestService = userRestService;
	}

	UserRestService getUserRestService() {
		return m_userRestService;
	}

	@Transactional(readOnly=true)
	@RequestMapping("/list")
	public ModelAndView getAllUsers() {
		final List<User> users = m_userRestService.getUsers();
		final ModelAndView mav = new ModelAndView("xmlView", BindingResult.MODEL_KEY_PREFIX + "users", users);
		return mav;
	}
	
	@Transactional(readOnly=true)
	@RequestMapping("/{username}")
	public ModelAndView getUser(@PathVariable final String username) {
		final User user = m_userRestService.getUser(username);
		final ModelAndView mav = new ModelAndView("xmlView", BindingResult.MODEL_KEY_PREFIX + "user", user);
		return mav;
	}
}
