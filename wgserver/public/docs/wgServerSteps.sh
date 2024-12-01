

#for server config file for wg0.conf
sv_privkey=wg genkey
# sv_psk=wg genpsk
sv_pubkey =echo $sv_privkey | wg pubkey

#create SV conf #PublicKey : just information
echo "[Interface]
Address = 172.22.0.1/24
ListenPort = 41820
PrivateKey = $sv_privkey
#PublicKey= $sv_pubkey
" > /server/config/wg0.conf


#for the every client  ############################

c_privkey=wg genkey
c_psk=wg genpsk
c_pubkey =echo $c_privkey | wg pubkey

c_ipaddr=172.22.0.2/24
#append client define to server conf #PrivateKey : just information 
echo "[Peer]
#node_12050
PublicKey = $c_pubkey #important this is server pubkey. same every peer
PresharedKey = $c_psk
#PrivateKey = $c_privkey
AllowedIPs = 172.22.0.2/24
" >> /server/config/wg0.conf
 
 #service restart or quick up or:
echo  $c_psk > c_psk.key
wg set wg0 peer $c_pubkey preshared-key c_psk.key allowed-ips $c_ipaddr


# client config   sent to cilent we dont need store server side #### important  PublicKey= server pubkey. same for all peer clientside conf
echo "
[Peer]
PublicKey = $sv_pubkey 
PresharedKey = $c_psk
AllowedIPs =  $c_ipaddr
" >send_to_remote_client_wg

#for the every client  ############################