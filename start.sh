#!/bin/sh

MAVEN_OPTS="-Xmx512m -server" mvn -Dmaven.test.skip.exec=true -Dorg.slf4j.simpleLogger.defaultLogLevel=debug -DstatusNetHost=statusnet.raccoonfink.com install jetty:run 2>&1
