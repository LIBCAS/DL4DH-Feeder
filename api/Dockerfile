FROM alpine:latest

RUN apk add --update maven openjdk11 \
    && rm -rf /var/cache/apk/*

ADD pom.xml /root/pom.xml
COPY feeder-api/ /root/feeder-api/
COPY feeder-core/ /root/feeder-core/

RUN mvn -f /root/pom.xml -Dmaven.test.skip clean package

ENTRYPOINT java -jar /root/feeder-api/target/feeder-api-*.jar
