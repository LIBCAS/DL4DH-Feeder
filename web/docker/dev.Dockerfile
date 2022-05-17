FROM httpd:alpine

# Apache conf
COPY ./web/docker/httpd.conf /usr/local/apache2/conf/httpd.conf
COPY ./web/docker/.htaccess /usr/local/apache2/htdocs/
