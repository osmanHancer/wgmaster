cName="u_10000"
PASSW="AAAAAzxP9fhvOS4s3tmRaTnaAAAAB"
HOST="192.168.0.20"
WEBPROTO="http"
FW=$(uci get system.system.device_fw_version)
SN=$(mnf_info -s)
IMEI=$(gsmctl -a)
rm /root/mylog.log
TC=60
ti=0
echo "$ti. waiting connection" >> /root/mylog.log
while [ "$ti" -lt "$TC" ] && ! ping -q -c 1 -W 5 1.1.1.1; do
    ti=$((ti+1))
    sleep 1
done


if [ "$ti" -lt "$TC" ]; then
    echo "$ti. internet connected" >> /root/mylog.log
    curl -s "$WEBPROTO://$HOST/xmodem/startup.php" --data-urlencode "cName=$cName" --data-urlencode "FW=$FW"  --data-urlencode "PASSW=$PASSW" --data-urlencode "SN=$SN" --data-urlencode "HOST=$HOST"  | ash | tee -a /root/mylog.log
else
    echo "internet not found skipping" >> /root/mylog.log
    exit 0
fi

sleep 5

ti=0
while [ "$ti" -lt "$TC" ] && ! ping -q -c 1 -W 2 172.22.0.1; do
    ti=$((ti+1))g
    sleep 1
done
if [ "$ti" -lt "$TC" ]; then
   echo "WG $ti/$TC. connected" >> /root/mylog.log
else
    echo "WG $ti/$TC not connect. break" >> /root/mylog.log
fi

#curl -s 192.168.0.20/xmodem/startup.php --data-urlencode "psk=6PY707+t8Y7yd1vIF5OcUQnEf/zCdUnkWIMmpPhl22Q=" --data-urlencode "node=12050" | ash

#n_12023 dZLnHZzxP9fhvOS4s3tmRaTnYqogBGs 10.8.0.77 0.9  AMAS K16 
#n_12022 AAAAAzxP9fhvOS4s3tmRaTnaAAAAA   10.8.0.78 0.11 AMAS K15-37