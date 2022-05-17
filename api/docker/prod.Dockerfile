# syntax = docker/dockerfile:experimental

FROM alpine:latest

RUN apk add --update maven openjdk11 \
    && rm -rf /var/cache/apk/*

ADD api/pom.xml /root/pom.xml
COPY api/feeder-api/ /root/feeder-api/
COPY api/feeder-core/ /root/feeder-core/

RUN  \
     --mount=type=cache,id=maven,target=/root/.m2 \
     mvn -f /root/pom.xml -Dmaven.test.skip clean package

ENTRYPOINT java -jar /root/feeder-api/target/feeder-api-*.jar
