package com.raccoonfink.cruisemonkey.dao.neo4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.neo4j.repository.GraphRepository;

import com.raccoonfink.cruisemonkey.dao.UserDao;
import com.raccoonfink.cruisemonkey.model.User;

public class GraphUserDao extends AbstractGraphDao<User, Long> implements UserDao {
	@Autowired
	public UserRepository m_userRepository;

	@Override
	protected GraphRepository<User> repository() {
		return m_userRepository;
	}

	@Override
	public User get(final String username) {
		return m_userRepository.findByPropertyValue("username", username);
	}

}
