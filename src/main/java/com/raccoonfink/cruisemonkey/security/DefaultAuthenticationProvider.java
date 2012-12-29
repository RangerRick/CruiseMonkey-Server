package com.raccoonfink.cruisemonkey.security;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.AbstractUserDetailsAuthenticationProvider;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import com.raccoonfink.cruisemonkey.dao.UserDao;
import com.raccoonfink.cruisemonkey.model.User;
import com.raccoonfink.cruisemonkey.server.StatusNetService;
import com.raccoonfink.cruisemonkey.server.StatusNetServiceFactory;

public class DefaultAuthenticationProvider extends AbstractUserDetailsAuthenticationProvider implements InitializingBean {
	@Autowired
	private UserDao m_userDao;

	static {
		StatusNetServiceFactory.setHost(System.getProperty("statusNetHost", "192.168.211.72"));
		StatusNetServiceFactory.setPort(Integer.valueOf(System.getProperty("statusNetPort", "80")));
		StatusNetServiceFactory.setRoot(System.getProperty("statusNetRoot", "/statusnet"));
	}

	private StatusNetServiceFactory m_statusNetServiceFactory = StatusNetServiceFactory.getInstance();

	@Override
	protected void doAfterPropertiesSet() throws Exception {
		Assert.notNull(m_userDao);
	}

	@Override
	protected void additionalAuthenticationChecks(final UserDetails userDetails, final UsernamePasswordAuthenticationToken token) throws AuthenticationException {
        if (userDetails.getPassword() == null || !userDetails.getPassword().equals(token.getCredentials().toString())) {
        	System.err.println("additionalAuthenticationChecks failed");
            throw new BadCredentialsException(messages.getMessage("AbstractUserDetailsAuthenticationProvider.badCredentials", "Bad credentials"));
        }
	}

	@Override
	protected UserDetails retrieveUser(final String username, final UsernamePasswordAuthenticationToken token) throws AuthenticationException {
		System.err.println("DefaultAuthenticationProvider::retrieverUser(): username = " + username);
        if (!StringUtils.hasLength(username)) {
            System.err.println("DefaultAuthenticationProvider::retrieverUser(): Authentication attempted with empty username");
            throw new UsernameNotFoundException(messages.getMessage("AbstractUserDetailsAuthenticationProvider.emptyUsername", "Username cannot be empty"));
        }
        final String password = token.getCredentials().toString();
        if (!StringUtils.hasLength(password)) {
            System.err.println("DefaultAuthenticationProvider::retrieverUser(): Authentication attempted with empty password");
            throw new InsufficientAuthenticationException(messages.getMessage(
                "AbstractUserDetailsAuthenticationProvider.badCredentials", "Bad credentials"));
        }

        UserDetails user = m_userDao.get(username);
        System.err.println("DefaultAuthenticationProvider::retrieverUser(): user = " + user);
        if (user == null || !password.equals(user.getPassword())) {
        	final StatusNetService sn = m_statusNetServiceFactory.getService(username, password);
        	try {
            	sn.authorize();
            	user = sn.getUser();
            	m_userDao.save((User)user);
        	} catch (final Exception e) {
        		System.err.println("DefaultAuthenticationProvider::retrieverUser(): exception while retrieving " + username);
        		e.printStackTrace(System.err);
                throw new InsufficientAuthenticationException(messages.getMessage("AbstractUserDetailsAuthenticationProvider.badCredentials", "Bad credentials"));
        	}
        }
        
        System.err.println("DefaultAuthenticationProvider::retrieverUser(): returning user = " + user);
        return user;
	}

}
