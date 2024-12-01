FROM ubuntu:latest as wgserver
ENV DEBIAN_FRONTEND="noninteractive"
RUN apt -y update 
RUN apt -y install wireguard wireguard-tools iproute2 
RUN apt -y install curl iputils-ping iptables

RUN mkdir /wg
WORKDIR /wg
COPY ./init_client.sh /wg/init_client.sh
RUN chmod 775  /wg/init_client.sh

CMD ["/bin/bash","/wg/init_client.sh"]