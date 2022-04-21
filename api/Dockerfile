FROM alpine:latest

RUN apk add --update maven openjdk11 \
    && rm -rf /var/cache/apk/*

ADD pom.xml /root/pom.xml
COPY krameriusplus-api/ /root/krameriusplus-api/
COPY krameriusplus-domain/ /root/krameriusplus-domain/
COPY krameriusplus-service/ /root/krameriusplus-service/

RUN mvn -f /root/pom.xml dependency:go-offline
RUN mvn -f /root/pom.xml -Dmaven.test.skip clean package spring-boot:repackage

ENTRYPOINT java -jar /root/target/api-*.jar
