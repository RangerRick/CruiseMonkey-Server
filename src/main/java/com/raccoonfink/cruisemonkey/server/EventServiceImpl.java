package com.raccoonfink.cruisemonkey.server;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;

import com.raccoonfink.cruisemonkey.dao.EventDao;
import com.raccoonfink.cruisemonkey.model.Event;

public class EventServiceImpl implements EventService, InitializingBean {
	final Logger m_logger = LoggerFactory.getLogger(EventServiceImpl.class);

	@Autowired
	private EventDao m_eventDao;

	@Autowired
	private UserService m_userService;

	@Autowired
	private SessionFactory m_sessionFactory;

	@Override
	public void afterPropertiesSet() throws Exception {
		Assert.notNull(m_eventDao);
	}

	@Override
	public Event getEvent(final String id) {
		return m_eventDao.get(id);
	}

	@Override
	public List<Event> getEvents(final String userName) {
		return new ArrayList<Event>(m_eventDao.findByUser(userName));
	}

	@Override
	public List<Event> getEventsInRange(final Date start, final Date end, final String userName) {
		return new ArrayList<Event>(m_eventDao.findInRange(start, end, userName));
	}

	@Override
	public void putEvent(final Event event) {
		m_eventDao.save(event);
	}

	@Override
	public void putEvent(final Event event, final String userName) {
		if (event.getCreatedBy() == null) {
			event.setCreatedBy(userName);
		}
		m_eventDao.save(event);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Event> getPublicEvents(final String userName) {
		if (userName == null) throw new IllegalArgumentException("You must provide a username!");

		final Session session = m_sessionFactory.getCurrentSession();

		final Criteria criteria = session.createCriteria(Event.class);
		criteria.add(
			Restrictions.or(
				new Criterion[] {
						Restrictions.eq("createdBy", userName).ignoreCase(),
						Restrictions.eq("createdBy", "official").ignoreCase(),
						Restrictions.eq("isPublic", true)
				}
			)
		);

		criteria.addOrder(Order.asc("startDate"))
			.addOrder(Order.asc("createdDate"))
			.addOrder(Order.asc("summary"));

		return (List<Event>)criteria.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Event> getPublicEventsInRange(final Date start, final Date end, final String userName) {
		if (userName == null) throw new IllegalArgumentException("You must provide a username!");

		final Session session = m_sessionFactory.getCurrentSession();

		final Criteria criteria = session.createCriteria(Event.class);
		criteria.add(
			Restrictions.or(
				new Criterion[] {
						Restrictions.eq("createdBy", userName).ignoreCase(),
						Restrictions.eq("createdBy", "official").ignoreCase(),
						Restrictions.eq("isPublic", true)
				}
			)
		);

		criteria.add(Restrictions.ge("startDate", start))
			.add(Restrictions.le("endDate", end));

		criteria.addOrder(Order.asc("startDate"))
			.addOrder(Order.asc("createdDate"))
			.addOrder(Order.asc("summary"));

		return (List<Event>)criteria.list();
	}
	
	@Override
	public void deleteEvent(final Event event) {
		if (event == null) throw new IllegalArgumentException("You must provide an event to delete!");
		
		m_eventDao.delete(event);
	}
}
