WG_IF="wg0"
WG_PORT="%SVPort%"
WG_ADDR="%ipaddr%/24" 
WG_ADDR_Z="%ipaddr_z%/24" 
WG_SERV="%HOST%"
C_NAME="%cName%"

# Client private key
WG_KEY="%#PrivateKey%"
# WG_PSK="%PresharedKey%"
WG_PUB="%SVPublicKey%"



# Configure network
uci -q delete network.${WG_IF}
uci set network.${WG_IF}="interface"
uci set network.${WG_IF}.proto="wireguard"
uci set network.${WG_IF}.private_key="${WG_KEY}"
uci set network.${WG_IF}.disabled="0"
uci add_list network.${WG_IF}.addresses="${WG_ADDR}"




# Add VPN peers
uci -q delete network.wgpeer
uci set network.wgpeer="wireguard_${WG_IF}"
uci set network.wgpeer.public_key="${WG_PUB}"
# uci set network.wgpeer.preshared_key="${WG_PSK}"
uci set network.wgpeer.endpoint_host="${WG_SERV}"
uci set network.wgpeer.endpoint_port="${WG_PORT}"
uci set network.wgpeer.route_allowed_ips="0"
uci set network.wgpeer.persistent_keepalive="55"
uci add_list network.wgpeer.allowed_ips="${WG_ADDR_Z}"
# uci add_list network.wgpeer.allowed_ips="::/0"
uci commit network
/etc/init.d/network restart

#firewall add  wgvpn to vpn zone  for teltonika  @zone[2]="vpn" 
uci rename firewall.@zone[2]="vpn"  
uci del_list firewall.vpn.network="${WG_IF}"
uci add_list firewall.vpn.network="${WG_IF}"
uci commit firewall
/etc/init.d/firewall restart

sleep 5

wg_ip=$(ip -f inet addr show $WG_IF | sed -En -e 's/.*inet ([0-9.]+).*/\1/p')
wg_sv_ip=${wg_ip%.*}.1


uci -q delete ping_reboot.prboot
uci add ping_reboot prboot
uci set ping_reboot.prboot=ping_reboot

uci set ping_reboot.prboot.action='1'                                                                             
uci set ping_reboot.prboot.retry='2'                                                                              
uci set ping_reboot.prboot.time_out='25'                                                                           
uci set ping_reboot.prboot.interface='1'                                                                          
uci set ping_reboot.prboot.stop_action='0'                                                                        
uci set ping_reboot.prboot.enable='1'                                                                             
uci set ping_reboot.prboot.packet_size='8'                                                                       
uci set ping_reboot.prboot.type='ping'                                                                            
uci set ping_reboot.prboot.modem='1-1'                                                                            
uci set ping_reboot.prboot.ip_type='ipv4'                                                                         
uci set ping_reboot.prboot.host=$wg_sv_ip                                                               
uci set ping_reboot.prboot.time='2'                                                                              
uci set ping_reboot.prboot.current_try='0'   
uci commit ping_reboot


