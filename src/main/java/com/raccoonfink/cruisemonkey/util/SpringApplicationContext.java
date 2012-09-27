package com.raccoonfink.cruisemonkey.util;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

public class SpringApplicationContext implements ApplicationContextAware {
	private static ApplicationContext m_context;

	@Override
	public void setApplicationContext(final ApplicationContext context) throws BeansException {
		m_context = context;
	}

	public static <T> T getBean(final String beanName, final Class<T> clazz) {
		return m_context.getBean(beanName, clazz);
	}
}
