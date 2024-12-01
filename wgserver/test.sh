#!/bin/bash

function ifup {
    typeset output
    output=$(ip link show "$1" up) && [[ -n $output ]]
}

conf_folder=/wg/conf/
wg_if=wg0




if ifup ${wg_if}; then
    echo "${wg_if} online"
else
    echo "${wg_if} downnnn"
fi


# /wg/conf/wg0.conf  linked to /etc/wireguard/wg0.conf

