FROM ubuntu:latest as wgserver
ENV DEBIAN_FRONTEND="noninteractive"
RUN apt -y update 
RUN apt -y install wireguard wireguard-tools iproute2  
RUN apt install -y php php-mysql php-apcu supervisor
RUN apt install -y nano net-tools  iputils-ping iptables

RUN mkdir /wg
WORKDIR /wg



CMD ["/usr/bin/supervisord", "-c", "/wg/conf/supervisord.conf"]
# CMD ["php", "-S", "0.0.0.0:2323","-t", "/wg/public" ]

