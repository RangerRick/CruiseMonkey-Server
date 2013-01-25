package com.raccoonfink.cruisemonkey.dao.neo4j;

import org.springframework.data.neo4j.repository.GraphRepository;

import com.raccoonfink.cruisemonkey.model.Favorite;

public interface FavoriteRepository extends GraphRepository<Favorite> {}
