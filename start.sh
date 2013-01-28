#!/bin/sh

MAVEN_OPTS="-server -Xmx512m -Xms128m" mvn -Dmaven.test.skip.exec=true -Dorg.slf4j.simpleLogger.defaultLogLevel=debug -DstatusNetHost=statusnet.raccoonfink.com install jetty:run 2>&1
