package com.raccoonfink.cruisemonkey.dao.neo4j;

import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.neo4j.conversion.EndResult;
import org.springframework.data.neo4j.repository.GraphRepository;
import org.springframework.stereotype.Service;

import com.raccoonfink.cruisemonkey.dao.FavoriteDao;
import com.raccoonfink.cruisemonkey.model.Favorite;

@Service
public class GraphFavoriteDao extends AbstractGraphDao<Favorite,Long> implements FavoriteDao {
	@Autowired
	public FavoriteRepository m_favoriteRepository;

	@Override
	protected GraphRepository<Favorite> repository() {
		return m_favoriteRepository;
	}

	@Override
	public List<Favorite> findByUser(final String userName) {
		return asList(m_favoriteRepository.findAllByPropertyValue("user", userName));
	}

	@Override
	public Favorite findByUserAndEventId(final String userName, final String eventId) {
		final EndResult<Favorite> result = m_favoriteRepository.findAllByPropertyValue("event", eventId);
		for (final Iterator<Favorite> i = result.iterator(); i.hasNext(); ) {
			final Favorite fav = i.next();
			if (fav.getUser().equals(userName)) {
				return fav;
			}
		}
		return null;
	}

}
