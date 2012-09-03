package com.raccoonfink.cruisemonkey.security;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.AbstractUserDetailsAuthenticationProvider;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import com.raccoonfink.cruisemonkey.dao.UserDao;

public class DefaultAuthenticationProvider extends AbstractUserDetailsAuthenticationProvider implements InitializingBean {
	@Autowired
	private UserDao m_userDao;

	@Override
	protected void doAfterPropertiesSet() throws Exception {
		Assert.notNull(m_userDao);
	}

	@Override
	protected void additionalAuthenticationChecks(final UserDetails userDetails, final UsernamePasswordAuthenticationToken token) throws AuthenticationException {
        if (!userDetails.getPassword().equals(token.getCredentials().toString())) {
            throw new BadCredentialsException(messages.getMessage("AbstractUserDetailsAuthenticationProvider.badCredentials", "Bad credentials"));
        }
	}

	@Override
	protected UserDetails retrieveUser(final String username, final UsernamePasswordAuthenticationToken token) throws AuthenticationException {
        if (!StringUtils.hasLength(username)) {
            logger.info("Authentication attempted with empty username");
            throw new BadCredentialsException(messages.getMessage("RadiusAuthenticationProvider.emptyUsername", "Username cannot be empty"));
        }
        final String password = (String) token.getCredentials();
        if (!StringUtils.hasLength(password)) {
            logger.info("Authentication attempted with empty password");
            throw new BadCredentialsException(messages.getMessage(
                "AbstractUserDetailsAuthenticationProvider.badCredentials", "Bad credentials"));
        }

        final UserDetails user = m_userDao.get(username);
        if (user == null) {
            throw new BadCredentialsException(messages.getMessage("AbstractUserDetailsAuthenticationProvider.badCredentials", "Bad credentials"));
        }
        
        return user;
	}

}
