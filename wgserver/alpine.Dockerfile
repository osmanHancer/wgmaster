FROM alpine:edge as wgserver
ENV DEBIAN_FRONTEND="noninteractive"
RUN apk add --no-cache wireguard-tools iproute2 curl tcpdump util-linux  tzdata
RUN apk add --no-cache supervisor php82 php82-pecl-apcu php82-pdo_mysql
RUN apk add --no-cache nodejs npm 
RUN npm install -g @angular/cli@latest
ENV TZ=Europe/Istanbul

RUN mkdir /wg
WORKDIR /wg



CMD ["/usr/bin/supervisord", "-c", "/wg/conf/supervisord.conf"]
# CMD ["php", "-S", "0.0.0.0:2323","-t", "/wg/public" ]

