package com.raccoonfink.cruisemonkey.server;

public class UserRetrievalException extends Exception {
	private static final long serialVersionUID = -3300709341592321195L;

	public UserRetrievalException() {
		super();
	}

	public UserRetrievalException(final String message) {
		super(message);
	}

	public UserRetrievalException(final Throwable t) {
		super(t);
	}

	public UserRetrievalException(final String messages, final Throwable t) {
		super(messages, t);
	}

}
