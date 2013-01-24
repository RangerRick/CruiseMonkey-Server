package com.raccoonfink.cruisemonkey.controllers;

import java.net.URI;
import java.net.URISyntaxException;

import javax.ws.rs.core.UriBuilder;
import javax.ws.rs.core.UriInfo;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

public class RestServiceBase implements InitializingBean {
	public RestServiceBase() {
	}

	@Override
	public void afterPropertiesSet() throws Exception {
	}

	protected String getCurrentUser() {
		final Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if (principal instanceof UserDetails) {
			return ((UserDetails)principal).getUsername();
		}
		return null;
	}

    protected static URI getRedirectUri(final UriInfo m_uriInfo, final Object... pathComponents) {
        if (pathComponents != null && pathComponents.length == 0) {
            final URI requestUri = m_uriInfo.getRequestUri();
            try {
                return new URI(requestUri.getScheme(), requestUri.getHost(), requestUri.getPath().replaceAll("/$", "").replaceAll("\\?.*?$", ""), null);
            } catch (final URISyntaxException e) {
                return requestUri;
            }
        } else {
        	UriBuilder builder = m_uriInfo.getRequestUriBuilder();
            for (final Object component : pathComponents) {
                if (component != null) {
                    builder = builder.path(component.toString());
                }
            }
            return builder.build();
        }
    }
}
