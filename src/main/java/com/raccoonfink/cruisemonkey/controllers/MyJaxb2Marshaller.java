package com.raccoonfink.cruisemonkey.controllers;

import javax.xml.bind.annotation.XmlRootElement;

import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.oxm.jaxb.Jaxb2Marshaller;

public class MyJaxb2Marshaller extends Jaxb2Marshaller {

  @Override
  public boolean supports(@SuppressWarnings("rawtypes") final Class clazz) {
    return super.supports(clazz) ? true : AnnotationUtils.findAnnotation(clazz, XmlRootElement.class) != null;
  }
}