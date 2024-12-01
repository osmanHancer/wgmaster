

export WG_HOST="%HOST%" 
export WG_HOST_PORT="%SVPort%"
export WG_SV_IP="%SVIpaddr%"
export WG_CLIENT_ADDR="%ipaddr%/24" 

export WG_PRIVKEY="%#PrivateKey%"

export WG_SV_PUB="%SVPublicKey%"


wg_if=wg0

rm -f /etc/wireguard/${wg_if}.conf 

echo "
[Interface]
Address = ${WG_CLIENT_ADDR}
PrivateKey = ${WG_PRIVKEY}

[Peer]
PublicKey = ${WG_SV_PUB}
Endpoint = ${WG_HOST}:${WG_HOST_PORT}
AllowedIPs = ${WG_CLIENT_ADDR}
PersistentKeepalive = 55
"> /etc/wireguard/${wg_if}.conf


ip link delete ${wg_if}
sleep 1
wg-quick up ${wg_if}


sleep 5

wg_ip=$(ip -f inet addr show wg0 | sed -En -e 's/.*inet ([0-9.]+).*/\1/p')
wg_sv_ip=${wg_ip%.*}.1

if ping -c 2 -w 2 $wg_sv_ip &> /dev/null; then
    echo "WGClient ${wg_if} online"
else
    echo "WGClient ${wg_if} downnnn"
fi









