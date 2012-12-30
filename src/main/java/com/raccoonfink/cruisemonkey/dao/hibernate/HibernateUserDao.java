package com.raccoonfink.cruisemonkey.dao.hibernate;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Order;

import com.raccoonfink.cruisemonkey.dao.UserDao;
import com.raccoonfink.cruisemonkey.model.User;

public class HibernateUserDao extends AbstractHibernateDao<User,String> implements UserDao {

	@Override
	protected Class<User> getClassType() {
		return User.class;
	}

	@SuppressWarnings("unchecked")
	protected List<User> resultWithDefaultSort(final Criteria criteria) {
		final Criteria resultCriteria = criteria.addOrder(Order.asc("username"));
		return (List<User>)resultCriteria.list();
	}
}
