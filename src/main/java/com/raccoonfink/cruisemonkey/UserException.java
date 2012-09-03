package com.raccoonfink.cruisemonkey;

public class UserException extends RuntimeException {
	private static final long serialVersionUID = 5099003394022691689L;

	public UserException(final String msg) {
		super(msg);
	}
	
	public UserException(final Throwable t) {
		super(t);
	}
	
	public UserException(final String msg, final Throwable t) {
		super(msg, t);
	}
}
