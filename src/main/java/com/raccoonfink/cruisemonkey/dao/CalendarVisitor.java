package com.raccoonfink.cruisemonkey.dao;

import java.util.Date;

public interface CalendarVisitor {

	void visitCalendarStart();
	// void visitTimezone(final String timezoneId);

	void visitEventStart();
	void visitEventDateTimeStart(final Date date);
	void visitEventDateTimeEnd(final Date date);
	void visitEventId(String value);
	void visitEventDescription(String value);
	void visitEventLocation(String value);
	void visitEventSummary(String value);
	void visitEventEnd();

	void visitCalendarEnd();



}
