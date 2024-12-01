#!/bin/bash

cName="u_$HOSTNAME"
PASSW="$WGPassw"
HOST="192.168.0.145:2323"
WEBPROTO="http"
FW="linux"

it=0

echo "booting"

loginTry=0
totalErr=0
errCount=0
ww=5

wgreboot=$(<"/wgreboot")
if [ $((wgreboot)) -lt $((4)) ]; then

  wgreboot=$((wgreboot + 1))
  # echo $wgreboot
  echo $wgreboot >/wgreboot
fi

## faioover reboot daemon :
while true; do ## login curl
  loginTry=$((loginTry + 1))
  echo "login to :  $WEBPROTO://$HOST"
  curl -s $WEBPROTO://${HOST}/wgClient/get --data-urlencode "cName=$cName" --data-urlencode "passw=$PASSW" --data-urlencode "FW=$FW"  >/tmp/wg_pull.sh

  if [ $? -ne 0 ] && [ $loginTry -lt 20 ]; then
    echo "req result $? loginTry=$loginTry wait internet.."
    sleep 10
    continue
  fi

  echo "executing script..."
  chmod 777 /tmp/wg_pull.sh
  source /tmp/wg_pull.sh

  # wg_ip=$(ip -f inet addr show wg0 | sed -En -e 's/.*inet ([0-9.]+).*/\1/p')
  # wg_sv_ip=${wg_ip%.*}.1

  echo "found server ip: $wg_sv_ip looping..."
  pingErr=0
  while true; do # check ping loop
    sleep $ww
    it=$((it + 1))
    # count 1 timeout3 size 8byte
    ping -c 1 -w 2 -s 8 $wg_sv_ip &>/dev/null
    if [ $? -eq 0 ]; then
      echo "ping ok it=$it , totalErr=$totalErr"
      errCount=0
      pingErr=0
      wgreboot=0
      echo $wgreboot >/wgreboot
      # err=0
    else
      pingErr=$((pingErr + 1))
      errCount=$((errCount + 1))
      totalErr=$((totalErr + 1))
      echo "ping err. pingErr=$pingErr totalErr=$totalErr it=$it"
      if [ $pingErr -gt 2 ]; then
        echo "breaking to login or reboot"
        sleep $ww
        break
      fi
    fi

  done #check ping

  if [ $errCount -gt $((wgreboot * 10)) ]; then
    pingErr=0
    sleep 10
    echo "it=$it  reboot=$wgreboot loginTry=$loginTry totalErr=$totalErr  rbootTime=$(((err * 300) / 3600)) time=$(((it * 300) / 3600)) wgreboot* 10 =$((wgreboot * 10))"
    reboot
    # reboot
  fi

done # login loop

exit 0

## INSTALL SERVICE :

## nano /etc/systemd/system/wglogin.service  ::

<<com
[Unit]
Description=wireguard login service startup

[Service]
ExecStart=/home/adlight/Desktop/wg_login.sh
#ExecStop= rm /wgreboot

[Install]
WantedBy=multi-user.target


## systemctl enable wglogin

com
## systemctl enable wglogin
## systemctl start wglogin
