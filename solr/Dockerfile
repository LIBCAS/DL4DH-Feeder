FROM solr:8
LABEL maintainer="sekan@inqool.cz"

ADD conf /opt/solr/server/solr/configsets/feeder/conf
COPY plugins/*.jar /opt/solr/dist/
ADD run.sh /opt/solr
ENTRYPOINT ["bash", "-c", "/opt/solr/run.sh"]
