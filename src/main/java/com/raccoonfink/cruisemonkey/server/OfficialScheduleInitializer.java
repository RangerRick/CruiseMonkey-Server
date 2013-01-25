package com.raccoonfink.cruisemonkey.server;

import java.text.DateFormat;
import java.util.UUID;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import com.raccoonfink.cruisemonkey.dao.EventDao;
import com.raccoonfink.cruisemonkey.model.Event;
import com.raccoonfink.cruisemonkey.util.DateXmlAdapter;

@Transactional
public class OfficialScheduleInitializer implements InitializingBean {
	@Autowired
	EventDao m_eventDao;

	@Override
	public void afterPropertiesSet() throws Exception {
		Assert.notNull(m_eventDao);

		if (m_eventDao.count() == 0) {
			final DateFormat format = DateXmlAdapter.DATE_FORMAT;
			m_eventDao.save(new Event(UUID.randomUUID().toString(), "CocoCay - Bahamas", "Surrounded by the gentle, translucent waters of the Bahamas chain lies the secluded island of Coco Cay®. With its white-sand beaches and spectacular surroundings, CocoCay® is a wonderland of adventure. Reserved exclusively for Royal Caribbean guests, this tropical paradise has recently been updated with new aquatic facilities, nature trails and a ton of great places to just sit back, relax and enjoy a tropical drink.", format.parse("2013-02-11 07:00AM"), format.parse("2013-02-11 04:00PM"), "official", "CocoCay", true));
			m_eventDao.save(new Event(UUID.randomUUID().toString(), "Charlotte Amalie - St. Thomas", "St. Thomas is known as an idyllic vacation spot today, but its history is not so peaceful. In the 18th century, the island was at the center of a bustling pirate culture, as swashbuckling pirates such as Blackbeard and Drake traded stolen wares in the port of Charlotte Amalie. This world-renowned Caribbean island is home to amazing beaches, gorgeous sea and landscapes and unbelievable duty-free shopping.", format.parse("2013-02-13 11:00AM"), format.parse("2013-02-13 07:00PM"), "official", "St. Thomas", true));
			m_eventDao.save(new Event(UUID.randomUUID().toString(), "Philipsburg - St. Maarten", "When the Spanish closed their colonial fort on St. Maarten in 1648, a few Dutch and French soldiers hid on the island and decided to share it. Soon after, the Netherlands and France signed a formal agreement to split St. Maarten in half, as it is today. Philipsburg displays its Dutch heritage in its architecture and landscaping. The island offers endless stretches of beach, beautiful landscapes and great shopping.", format.parse("2013-02-14 08:00AM"), format.parse("2013-02-14 05:00PM"), "official", "St. Maarten", true));
		}
	}

}
