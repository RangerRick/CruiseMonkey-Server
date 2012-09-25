package com.raccoonfink.cruisemonkey.model;

import java.io.Serializable;
import java.util.Collection;
import java.util.Collections;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Transient;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

import org.apache.commons.lang.builder.CompareToBuilder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Entity
@XmlRootElement(name="user")
@XmlAccessorType(XmlAccessType.NONE)
public class User extends AbstractRecord implements UserDetails, Comparable<User>, Serializable {
	private static final long serialVersionUID = -5588394243858729656L;

	private String m_username;
	private String m_name;
	private String m_password;

	public User() {
		super();
	}

	public User(final String username, final String password, final String name) {
		m_username = username;
		m_password = password;
		m_name     = name;
	}

	@Id
	@Column(name="username", length=64, unique=true)
	@XmlAttribute(name="username")
	public String getUsername() {
		return m_username;
	}

	public void setUsername(final String username) {
		m_username = username;
	}

	@Column(name="name", length=256)
	@XmlElement(name="name")
	public String getName() {
		return m_name;
	}

	public void setName(final String name) {
		m_name = name;
	}

	@Transient
	@XmlElement(name="password")
	public String getPassword() {
		return m_password == null? null : "********";
	}
	
	public void setPassword(final String password) {
		m_password = password;
	}

	@Column(name="password", length=32)
	@XmlTransient
	public String getPlaintextPassword() {
		return m_password;
	}

	public void setPlaintextPassword(final String password) {
		m_password = password;
	}

	@Override
	@Transient
	@XmlTransient
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
	}

	@Override
	@Transient
	@XmlTransient
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	@Transient
	@XmlTransient
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	@Transient
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	@Transient
	@XmlTransient
	public boolean isEnabled() {
		return true;
	}

	@Override
	public int compareTo(final User that) {
		return new CompareToBuilder()
			.append(this.m_username, that.m_username)
			.append(this.m_name,     that.m_name)
			.toComparison();
	}
}
