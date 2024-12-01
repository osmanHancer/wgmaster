
<?php
header("Access-Control-Allow-Origin:*");
define('WG_CONF', "/etc/wireguard/wg0.conf");
define('HHOST', explode(':', $_SERVER['HTTP_HOST'])[0]);

define('DB_DB', 'dbwg');

class wgClientC extends Q_Controller
{

  function _init()
  {
    $this->autoRender = false;
  }
  public function __destruct()
  {
  }
  public function get()
  {
    $q = $_POST;
    // $q["passw"] = "dZLnfdfxPdffhvfOSdfs3gYqogBGs";
    // $q["cName"] = "u_wgclient1";

    if (!isset($q["passw"]) || !isset($q["cName"]) ) exit("err_nofield");

    $modem = dbH::dbLogin($q);
    if (!isset($modem["ipaddr"])) exit("err_dblogin");
    //if (!isset($modem["privateKey"]) || !isset($modem["publicKey"]))
    $clientConf = wgH::createPeer($modem);

    $q["PublicKey"] = $clientConf["PublicKey"];
    $q["PrivateKey"] = $clientConf["#PrivateKey"];
    $FW = dbC::escapeField($q["FW"]);

    $script = fileH::fileLoad(ROOT_PATH . "/push_$FW.sh");
    $script = fileH::remove_empty_lines($script);

    $clientConf["HOST"] = HHOST;   
     $clientConf["ipaddr_z"] =$clientConf["ipaddr"];


    $script = fileH::replaceBetween($script, $clientConf);

  
    echo $script;
  }
}
