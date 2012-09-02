package com.raccoonfink.cruisemonkey.model;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.thoughtworks.xstream.annotations.XStreamAlias;

@XStreamAlias("user")
public class User implements UserDetails {
	private static final long serialVersionUID = -4560511838361243686L;

	@XStreamAlias("username")
	private String m_username;
	
	@XStreamAlias("name")
	private String m_name;
	
	@XStreamAlias("password")
	private String m_password;

	public User() {
	}

	public User(final String username, final String password, final String name) {
		m_username = username;
		m_password = password;
		m_name     = name;
	}

	public String getUsername() {
		return m_username;
	}
	
	public void setUsername(final String username) {
		m_username = username;
	}
	
	public String getName() {
		return m_name;
	}
	
	public void setName(final String name) {
		m_name = name;
	}
	
	public String getPassword() {
		return m_password;
	}
	
	public void setPassword(final String password) {
		m_password = password;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}
}
