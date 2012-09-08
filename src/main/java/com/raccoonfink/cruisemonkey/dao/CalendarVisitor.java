package com.raccoonfink.cruisemonkey.dao;

import net.fortuna.ical4j.model.Component;

public interface CalendarVisitor {

	void begin();
	void visitEvent(final Component component);
	void visitTimezone(final Component component);
	void end();

}
