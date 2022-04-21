set -e
solr-precreate feeder /opt/solr/server/solr/configsets/feeder
docker-entrypoint.sh solr-foreground
