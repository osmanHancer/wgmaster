<?php

class wgH
{

    public static function createPeer($modem)
    {
        $svConf = wgH::getSVConf(WG_CONF);
        $resultConf = [];

        if (empty($modem["PrivateKey"]) || empty($modem["PublicKey"])) {
            $peerKey = exec("wg genkey");
            $peerPub = exec("echo $peerKey | wg pubkey"); // bu sadece serverde olacak.
            dbH::setKeys([
                "PrivateKey"=>$peerKey,
                "PublicKey"=>$peerPub,
                "cName"=>$modem["cName"]
        ]);
        } else {
            $peerKey = $modem["PrivateKey"];
            $peerPub = $modem["PublicKey"]; // bu sadece serverde olacak.
        }
        //$peerPsk = $founded ?  $findConf["PresharedKey"] : exec("wg genpsk");
        // $founded ?  explode('/', $findConf["AllowedIPs"])[0] :  newIp(ipNumList); // generate new ip
        $resultConf["PublicKey"] = $peerPub;
        $resultConf["#PrivateKey"] = $peerKey;
        // $pskPath = WG_CONF."peer.psk";
        // file_put_contents($pskPath, $peerPsk);
        $ipaddr = $modem["ipaddr"];
        $result = exec("wg set wg0 peer $peerPub persistent-keepalive 120 allowed-ips $ipaddr/32 ");

        $resultConf["SVPublicKey"] = $svConf["#PublicKey"];
        $resultConf["SVPort"] = $svConf["ListenPort"];
        $resultConf["SVIpaddr"] = explode('/',  $svConf["Address"])[0];  // 172.33.0.1/24 get 172.33.0.1
        $resultConf["ipaddr"] = $ipaddr;

        return $resultConf;
    }

    public static function getSVConf($file)
    {
        $configContent = fileH::fileLoad($file);
        $svConf = wgH::parseConf($configContent);
        return $svConf;
    }

    public static function parseConf($str)
    {
        $lines = explode("\n",  $str);
        if (!is_array($lines)) return null;
        $conf = [];
        foreach ($lines as $j => $l) {
            if (strlen($l) <= 1 || str_starts_with($l, '[')) continue;
            $ll = explode('=', $l, 2);
            $conf[trim($ll[0])] = trim($ll[1] ?? "");
        }
        return $conf;
    }

    public static function newIp($ipNumList)
    {
        for ($i = 2; $i < 254; $i++) {
            $res = array_search($i, $ipNumList);
            if ($res === false) {
                $svip = explode('/', SERVER_CONF["Address"])[0];
                $svv = explode('.', $svip);
                array_pop($svv);
                $svblock = implode(".", (array)$svv);
                define("SVIpBlock", $svblock);
                return $svblock . ".$i";
            }
        }
    }
    public static function findPeer($search)
    {
        $configContent = fileH::fileLoad(WG_CONF);
        $peerList = explode("[Peer]", $configContent);
        $svConfLines = explode("\n", $peerList[0]);
        define("SERVER_CONF", wgH::parseConf($svConfLines));

        $search = '#' . $search;
        //$peerList = array_splice($peerList,1,1); //remove first 
        unset($peerList[0]);
        $findConf = null;
        $ipNumList = [];
        foreach ($peerList as $pi => $peer) {
            $peerlines = explode("\n", $peer);
            $parsedConf = wgH::parseConf($peerlines);

            if (isset($parsedConf["AllowedIPs"])) { //ipleri hafızaya atlıyor daha sonra client için boş bir yere ip verebilmek için.
                $ip = explode('/', $parsedConf["AllowedIPs"])[0]; //remove after /24
                $ipp = explode('.', $ip);
                $ipindex = end($ipp);
                $ipNumList[] = $ipindex;
            }

            if (strpos($peer, $search) !== false) {
                $findConf = $parsedConf;
                $findConf["pi"] = $pi;
            }
        }
        define('ipNumList', $ipNumList);
        return $findConf;
    }

    
}
