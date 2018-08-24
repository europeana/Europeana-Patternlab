FROM europeana/styleguide-nginx

MAINTAINER Europeana Foundation <development@europeana.eu>

WORKDIR /data

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN compass compile source
RUN php core/console --generate
RUN $(npm bin)/grunt copy:js_templates

RUN rm -r /usr/share/nginx/html
RUN mv /data/public /usr/share/nginx/html
