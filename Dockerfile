FROM europeana/styleguide-nginx

MAINTAINER Europeana Foundation <development@europeana.eu>

WORKDIR /data

RUN rm -r /usr/share/nginx/html && mkdir -p /data/public && ln -s /data/public /usr/share/nginx/html

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN compass compile source
RUN php core/console --generate
RUN $(npm bin)/grunt copy:js_templates
