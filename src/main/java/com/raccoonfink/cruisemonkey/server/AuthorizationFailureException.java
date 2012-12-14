package com.raccoonfink.cruisemonkey.server;

public class AuthorizationFailureException extends Exception {
	private static final long serialVersionUID = 3996630165560203534L;

	public AuthorizationFailureException() {
		super();
	}

	public AuthorizationFailureException(final String message) {
		super(message);
	}

	public AuthorizationFailureException(final Throwable t) {
		super(t);
	}

	public AuthorizationFailureException(final String message, final Throwable t) {
		super(message, t);
	}

}
