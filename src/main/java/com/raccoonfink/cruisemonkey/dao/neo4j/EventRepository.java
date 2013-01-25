package com.raccoonfink.cruisemonkey.dao.neo4j;

import org.springframework.data.neo4j.repository.GraphRepository;

import com.raccoonfink.cruisemonkey.model.Event;

public interface EventRepository extends GraphRepository<Event> {
	
}
