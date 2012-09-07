package com.raccoonfink.cruisemonkey.dao.mock;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;
import java.util.UUID;

import org.apache.commons.lang.builder.CompareToBuilder;
import org.hibernate.Session;

import com.google.common.collect.Lists;
import com.raccoonfink.cruisemonkey.dao.EventDao;
import com.raccoonfink.cruisemonkey.model.Event;

public class MockEventDao implements EventDao {
	private Set<Event> m_events = new TreeSet<Event>();

	public MockEventDao() {
		final Date now = new Date();
		final Date hourAgo = new Date(now.getTime() - (60 * 60 * 1000));
		m_events.add(new Event(UUID.randomUUID().toString(), "test description", hourAgo, now, "ranger"));
	}

	@Override
	public Event get(final String id) {
		for (final Event event : m_events) {
			if (event.getId() == id) {
				return event;
			}
		}
		return null;
	}

	@Override
	public List<Event> findAll() {
		return sortedEventList(m_events);
	}

	@Override
	public List<Event> findInRange(final Date start, final Date end) {
		final long startTime = start.getTime();
		final long endTime   = end.getTime();

		final List<Event> events = new ArrayList<Event>();

		for (final Event event : m_events) {
			final long eventStartTime = event.getStartDate().getTime();
			final long eventEndTime   = event.getEndDate().getTime();
			if (eventStartTime < startTime && eventEndTime >= startTime) {
				// event overlaps with the start of the range
				events.add(event);
			} else if (eventStartTime >= startTime && eventEndTime <= endTime) {
				// event is equal to or contained inside the range
				events.add(event);
			} else if (eventEndTime > endTime && eventStartTime <= endTime) {
				// event overlaps with the end of the range
				events.add(event);
			}
		}

		return sortedEventList(events);
	}

	@Override
	public void save(final Event event) {
		m_events.add(event);
	}
	
	@Override
	public void save(final Event event, final Session session) {
	        m_events.add(event);
	}

	private List<Event> sortedEventList(final Collection<Event> events) {
		final List<Event> newList = Lists.newArrayList(events);
		Collections.sort(newList, new Comparator<Event>() {
			@Override
			public int compare(final Event left, final Event right) {
				return new CompareToBuilder()
					.append(left.getStartDate(), right.getStartDate())
					.append(left.getEndDate(), right.getEndDate())
					.append(left.getId(), right.getId())
					.append(left.getDescription(), right.getDescription())
					.toComparison();
			}
		});
		return newList;
	}
}
