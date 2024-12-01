Teltonika cli
- imei: gsmctl -a  
- serial: mnf_info -s

- Server interface private key  oluşturuluyor. bu private key ile server public key oluşturuluyor. clientlerin public keyi oluşturulan server public keyi oluyor.
- server deki peer tanımlarındaki publick keyler yeni oluşturulan public key oluyor.

wg genkey | tee /config/server/privatekey-server | wg pubkey > /config/server/publickey-server


Troubleshooting VPN

### Restart services
/etc/init.d/log restart; /etc/init.d/network restart; sleep 10
 
# Log and status
logread -e vpn; netstat -l -n -p | grep -e "^udp\s.*\s-$"
 
# Runtime configuration
pgrep -f -a wg; wg show; wg showconf vpn
ip address show; ip route show table all
ip rule show; iptables-save -c
ip -6 rule show; ip6tables-save -c
 
# Persistent configuration
uci show network; uci show firewall; crontab -l

##  wg client to client connection

If you want to enable it for all interfaces simply run:

` Set-NetIPInterface -Forwarding Enabled `

Check 

` Get-NetIPInterface | select ifIndex,InterfaceAlias,AddressFamily,ConnectionState,Forwarding | Sort-Object -Property IfIndex | Format-Table `

This will provide a nice table showing all the interfaces and their current forwarding configuration.

Then if you want to enable forwarding on one you can run:

` Set-NetIPInterface -ifindex {{INDEX_FROM_TABLE_TOP}} -Forwarding Enabled `



Then if you want to disable it again simply replace "Enabled" with "Disabled".

And remember to enable Routing and RemoteAccess(Routing and Remote Access) service (By default is disabled) by running:

` Set-Service RemoteAccess -StartupType Automatic; Start-Service RemoteAccess`

# Modem bilgi 
niğde güncellemeden sonra 10sn de bir atılan request problemi çözümü. veri kullanımı 2.5 kat arttırıyor.

http://10.8.0.79:35980/#/network/dns
DNS forwardings : /opkg.teltonika-networks.com/127.0.0.0



### test startup

cName="n_12023"
PASSW="dZLnHZzxP9fhvOS4s3tmRaTnYqogBGs"
HOST="predixi.com"
WEBPROTO="https"
FW=$(uci get system.system.device_fw_version)
SN=$(mnf_info -s)
IMEI=$(gsmctl -a)
rm /root/mylog.log
TC=60
ti=0
curl -s "$WEBPROTO://$HOST/xmodem/startup.php" --data-urlencode "cName=$cName" --data-urlencode "FW=$FW"  --data-urlencode "PASSW=$PASSW" --data-urlencode "SN=$SN" --data-urlencode "HOST=$HOST" | tee -a /root/mylog.log


# custodibus passw d82GQzWCjMKqueT
# custodibus login id CwxJXvBHSMF