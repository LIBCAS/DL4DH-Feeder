# Kramerius_plus

The following steps describe how to run the application. It assumes that at least Java 11 and maven is already installed and correctly set up.

# SOLR

First we need to download Solr from https://solr.apache.org/downloads.html. Kramerius_plus was implemented using the version 8.8.2. 

### Configsets
After downloading and extracting Solr, we need to set up the configset. Go to `solr/server/solr/configsets`. Create a new directory here called k`ramerius_plus`. Copy the schema.xml and solrconfig.xml from the `solr/conf` directory from this projet into this newly created directory `solr/server/solr/configsets/kramerius_plus`.

### Custom plugins
For Solr to recognize and use our custom plugins, we need to put it in a folder where Solr can find it. This folder can be configured in solrconfig.xml, but the default directory that is scanned for plugins on start up is `server/solr-webapp/webapp/WEB-INF/lib`. Copy the plugins from `solr/plugins` directory in this project and paste it into the default folder `server/solr-webapp/webapp/WEB-INF/lib`.

### Running Solr
Open the extracted Solr directory and go to the bin folder. Open a terminal window here and run the following commands:

// runs a solr node in solrCloud mode on port 8983
`solr start -c -p 8983`

// runs a second solr node in solrCloud mode on port 7574 and connects the node to a running cluster managed by the zookeeper
`solr start -c -p 7574 -z localhost:9983`

Solr should say that the nodes are running and ready for searching.

### Uploading the configset
After solr is successfully started, we need to upload our configsets so it can be used by our new collection. To upload a configset, run the following command from the `bin` directory:

`solr zk upconfig -n kramerius_plus ../server/solr/configsets/kramerius_plus -z localhost:9983`

### Creating a collection
We can use the COLLECTION API of Solr to create new collections. Just send the following GET request with an application such as POSTMAN for example:

`http://localhost:8983/solr/admin/collections?action=CREATE&name=kramerius_plus&numShards=2&replicationFactor=2&wt=json&collection.configName=kramerius_plus&maxShardsPerNode=4`

This request creates a new collection called `kramerius_plus` that uses our configsets, that we uploaded in the previous step.

# Kramerius+

To run the backend application, you first need to compile it by running the following command in the `/api` directory:

`mvn clean install`

Then you can run the application by running the following command in the `api/krameriusplus-api` directory:

`mvn spring-boot:run`