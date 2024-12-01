FROM alpine:edge as wgclient
ENV DEBIAN_FRONTEND="noninteractive"
RUN apk add --no-cache  wireguard-tools iproute2 curl 


RUN mkdir /wg
WORKDIR /wg
COPY ./init_client.sh /wg/init_client.sh


CMD ["/bin/bash","/wg/init_client.sh"]