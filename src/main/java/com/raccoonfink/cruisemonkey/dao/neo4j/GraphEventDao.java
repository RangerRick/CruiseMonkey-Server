package com.raccoonfink.cruisemonkey.dao.neo4j;

import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.neo4j.conversion.EndResult;
import org.springframework.data.neo4j.repository.GraphRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.raccoonfink.cruisemonkey.dao.EventDao;
import com.raccoonfink.cruisemonkey.model.Event;

@Service
public class GraphEventDao extends AbstractGraphDao<Event,Long> implements EventDao {
	@Autowired
	public EventRepository m_eventRepository;

	@Override
	protected GraphRepository<Event> repository() {
		return m_eventRepository;
	}

	@Override
	@Transactional(readOnly=true)
	public Event get(final String id) {
		return m_eventRepository.findByPropertyValue("id", id);
	}

	@Override
	@Transactional(readOnly=true)
	public List<Event> findByUser(final String userName) {
		return asList(m_eventRepository.findAllByPropertyValue("createdBy", userName));
	}

	@Override
	@Transactional(readOnly=true)
	public List<Event> findInRange(final Date start, final Date end, final String userName) {
		final long startTime = start.getTime();
		final long endTime   = end.getTime();

		final List<Event> events = new ArrayList<Event>();
		final EndResult<Event> result = m_eventRepository.findAllByPropertyValue("createdBy", userName);

		for (final Iterator<Event> i = result.iterator(); i.hasNext(); ) {
			final Event event = i.next();
			if (event.getStartDate().getTime() >= startTime && event.getEndDate().getTime() <= endTime) {
				events.add(event);
			}
		}

		return events;
	}
}
