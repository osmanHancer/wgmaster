echo " #!/bin/sh
      cName={{cName}}
      PASSW={{passw}}

        HOST="192.168.0.145:2323"
        WEBPROTO="http"
        FW="rut2"

        it=0
        echo "booting"
        loginTry=0
        totalErr=0
        errCount=0
        ww=5
        while read line; do wgreboot=\$line; done < /wgreboot

        if [ \$((wgreboot)) -lt \$((4)) ]; then
          wgreboot=\$((wgreboot + 1))
          echo \$wgreboot >/wgreboot
        fi

        while true; do
          loginTry=\$((loginTry + 1))
          echo "login to :  \$WEBPROTO://\$HOST"
          curl -s \$WEBPROTO://\$HOST/wgClient/get --data-urlencode "cName=\$cName" --data-urlencode "passw=\$PASSW" --data-urlencode "FW=\$FW"  >/tmp/wg_pull.sh

          if [ \$? -ne 0 ] && [ \$loginTry -lt 20 ]; then
            echo "req result \$? loginTry=\$loginTry wait internet.."
            sleep 10
            continue
          fi

          echo "executing script..."
          chmod 777 /tmp/wg_pull.sh
          source /tmp/wg_pull.sh
          echo "found server ip: \$wg_sv_ip looping..."

          pingErr=0
          while true; do
            sleep \$ww
            it=\$((it + 1))

            ping -c 1 -w 2 -s 8 \$wg_sv_ip &>/dev/null

            if [ \$? -eq 0 ]; then
              echo "ping ok it=\$it , totalErr=\$totalErr"
              errCount=0
              pingErr=0
              wgreboot=0
              echo \$wgreboot >/wgreboot

            else
              pingErr=\$((pingErr + 1))
              errCount=\$((errCount + 1))
              totalErr=\$((totalErr + 1))
              echo "ping err. pingErr=\$pingErr totalErr=\$totalErr it=\$it"

              if [ \$pingErr -gt 2 ]; then
                echo "breaking to login or reboot"
                sleep \$ww
                break
              fi
            fi
          done

          if [ \$errCount -gt \$((wgreboot * 10)) ]; then
            pingErr=0
            sleep 10
            reboot
          fi
        done
        exit 0" > /wglogin

        echo "#!/bin/sh /etc/rc.common
        START=99
        STOP=1
        USE_PROCD=1
        NAME=wglogin
        start_service() {
            procd_open_instance wglogin
            procd_set_param command /bin/sh "/wglogin"
            procd_close_instance
        }
        stop_service() {
            echo "stop"
        }
        " >/etc/init.d/wglogin
        chmod 777 /etc/init.d/wglogin
        /etc/init.d/wglogin enable
        sleep 5
        /etc/init.d/wglogin start
        exit 0
