#!/bin/bash

conf_folder="/wg/conf/"
wg_ip_block="172.33.0"
wg_sv_port="41820"
wg_if=wg0

sysctl -w net.ipv4.ip_forward=1
sysctl -w net.ipv4.conf.all.src_valid_mark=1



if [[ -f ${conf_folder}/${wg_if}.conf ]]
then
    echo "wg0.conf existing skipping create"
else
    echo "creating wg server"
    mkdir -p ${conf_folder}
    sv_privkey=`wg genkey`
    sv_pubkey=`echo "${sv_privkey}" | wg pubkey`

    echo "${sv_privkey}" > ${conf_folder}sv-priv.key
    echo "${sv_pubkey}" > ${conf_folder}sv-pub.key

    echo "  
[Interface]
Address = ${wg_ip_block}.1/24
ListenPort = ${wg_sv_port} 
PrivateKey = ${sv_privkey} 
#PublicKey= ${sv_pubkey}
PostUp   = iptables -A FORWARD -i %i -j ACCEPT; iptables -A FORWARD -o %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -D FORWARD -o %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
"> ${conf_folder}/${wg_if}.conf

fi
rm /etc/wireguard/${wg_if}.conf
ln -s /wg/conf/${wg_if}.conf /etc/wireguard/${wg_if}.conf
# chmod 600 /etc/wireguard/${wg_if}.conf

ip link delete ${wg_if}
wg-quick up ${wg_if}

if ping -c 2 -w 2 ${wg_ip_block}.1 &> /dev/null; then
    echo "WGSERVER ${wg_if} online"
else
    echo "WGSERVER ${wg_if} downnnn"
fi
# /wg/conf/wg0.conf  linked to /etc/wireguard/wg0.conf

