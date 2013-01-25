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
import javax.xml.bind.annotation.XmlID;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

import org.apache.commons.lang.builder.CompareToBuilder;
import org.eclipse.persistence.oxm.annotations.XmlReadOnly;
import org.springframework.data.neo4j.annotation.GraphId;
import org.springframework.data.neo4j.annotation.Indexed;
import org.springframework.data.neo4j.annotation.NodeEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Entity
@XmlRootElement(name="user")
@XmlAccessorType(XmlAccessType.NONE)
@NodeEntity
public class User extends AbstractRecord implements UserDetails, Comparable<User>, Serializable {
	private static final long serialVersionUID = 4L;

	@GraphId
	private Long m_id;

	@Indexed(fieldName="username", unique=true)
	private String m_username;

	private String m_displayName;

	private String m_fullName;

	private String m_password;

	public User() {
		super();
	}

	public User(final String username, final String displayName, final String password, final String name) {
		m_username     = username;
		m_displayName  = displayName;
		m_password     = password;
		m_fullName     = name;
	}

	public Long getId() {
		return m_id;
	}
	
	public void setId(final Long id) {
		m_id = id;
	}

	@Override
	@XmlID
	@XmlAttribute(name="username", required=true)
	@Id
	@Column(name="username", length=64, unique=true)
	public String getUsername() {
		return m_username;
	}

	public void setUsername(final String username) {
		m_username = username;
	}

	@XmlElement(name="displayName")
	@Column(name="displayName", length=64)
	public String getDisplayName() {
		return m_displayName;
	}

	public void setDisplayName(final String displayName) {
		m_displayName = displayName;
	}

	@XmlElement(name="name")
	@Column(name="name", length=256)
	public String getFullName() {
		return m_fullName;
	}

	public void setFullName(final String name) {
		m_fullName = name;
	}

	@Override
	@XmlElement(name="password")
	@XmlReadOnly
	@Column(name="password", length=40)
	public String getPassword() {
		return m_password;
	}

	public void setPassword(final String password) {
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
			.append(this.m_fullName, that.m_fullName)
			.toComparison();
	}

	@Override
	public String toString() {
		return "User [username=" + m_username + ", displayName=" + m_displayName + ", name=" + m_fullName + ", password=HIDDEN]";
	}
}
