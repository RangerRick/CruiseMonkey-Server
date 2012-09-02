package com.raccoonfink.cruisemonkey.server;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.raccoonfink.cruisemonkey.model.User;

@Controller
public class UserRestServiceController {
	@Autowired
	UserRestService m_userService;

	@RequestMapping(value="/all")
	public ModelAndView getAllUsers() {
		final List<User> users = m_userService.getUsers();
		final ModelAndView mav = new ModelAndView("userXmlView", BindingResult.MODEL_KEY_PREFIX + "users", users);
		return mav;
	}
	
	@RequestMapping(value="/{username}")
	public ModelAndView getUser(@PathVariable final String username) {
		final User user = m_userService.getUser(username);
		final ModelAndView mav = new ModelAndView("userXmlView", BindingResult.MODEL_KEY_PREFIX + "user", user);
		return mav;
	}
}
