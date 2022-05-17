# syntax = docker/dockerfile:experimental

## BUILD image ##
FROM node:16-alpine AS builder
WORKDIR /build

# Switch to yarn 2
RUN yarn set version 3.1.1

# RUN echo "" > .yarnrc.yml

# Install dependencies
COPY ./web/package.json ./web/yarn.lock ./
RUN yarn install

# Copy and build app
COPY ./web/src ./src
COPY ./web/public ./public
COPY ./web/tsconfig.json ./
RUN yarn build


## RUN Image ##
FROM httpd:alpine

# Apache conf
COPY ./web/docker/httpd.conf /usr/local/apache2/conf/httpd.conf

COPY --from=builder /build/build/ /usr/local/apache2/htdocs/
COPY ./web/docker/.htaccess /usr/local/apache2/htdocs/

