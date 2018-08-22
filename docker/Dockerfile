FROM nginx

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update
RUN apt-get -yq install apt-utils
RUN apt-get -yq install gcc make php ruby ruby-dev
RUN apt-get -yq install grunt

RUN echo "gem: --no-rdoc --no-ri" >> /etc/gemrc
RUN gem install compass

CMD cd /data && \
  compass compile source && \
  php core/console --generate && \
  npm install && \
  grunt copy:js_templates && \
  nginx -g 'daemon off;'
