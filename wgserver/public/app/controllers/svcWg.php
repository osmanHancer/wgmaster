
<?php
define('DB_DB', 'dbwg');

class SvcwgC extends Q_Controller
{
  function _init()
  {

    header("Access-Control-Allow-Origin: *");
    $this->apiEnable();
    // error_reporting(E_ERROR | E_PARSE);
    define('HELPER_PATH', __DIR__ . '/helpers/');
    define('HHOST', explode(':', $_SERVER['HTTP_HOST'])[0]);
  }
  public function modemList()
  {
    $data = QQ()->t("modems")->s("modemPK ,cName,ipaddr,createdTime,lastTry")->w("modemPK>0")->all();
    phpH::json($data);
  }
  public function getModem()
  {
    $q = $_POST;
    $data = QQ()->t("modems")->s("modemPK ,cName ,passw,ipaddr,createdTime")->w("modemPK=:modemPK")->one($q);
    phpH::json($data);
  }
  public function modemLog()
  {
    $q = $_POST;
    $stm = QQ()->t("modem_log")->s("*")->o("time DESC");
    if (isset($q["from"]) && isset($q["to"]))
      $data = $stm->w("time BETWEEN :from AND :to")->all($q);
    else
      $data = $stm->all();
    phpH::json($data);
  }

  public function setModem()
  {
    //method 1
    $q = $_POST;
    if ($q["_action"] == "delete") {
      $data_1["modem"] = QQ()->t("modems")->s("*")->w("modemPK=:modemPK")->one($q);
      $data = QQ()->t("modems")->w("modemPK=:modemPK ")->del($q, getSql: false);
      exec("wg set wg0  peer " . $data_1["modem"]["PublicKey"] . " remove", $outcome_2, $code);
    } else {
      $q["passSalt"] = dbH::getRandomString(10);
      $q["passhash"] = hash('sha384', $q["passSalt"] . $q["passw"]);
      $data = QQ()->t('modems')->ins($q, dubUpdate: true);
    }
    if ($q["_action"] == "pkupdate") {
      exec("wg set wg0  peer " . $q["_oldPublicKey"] . " remove", $outcome_2, $code);
    }

    phpH::json($data);
  }

  public function getNewIp()
  {
    $db = dbC::getDB();
    $data = $db->one("SELECT  INET_NTOA(INET_ATON(p.ipaddr) + 1) AS FirstAvailableIP FROM modems p
    LEFT JOIN modems p1 ON INET_ATON(p1.ipaddr) = INET_ATON(p.ipaddr) + 1
    WHERE p1.modemPK IS NULL
    ORDER BY INET_ATON(p.ipaddr)
    LIMIT 0, 1;
    ");
    phpH::json($data);
  }

  public function getClientStatus()
  {

    $q = $_POST;
    if (!isset($q["modemPK"]))  phpH::err("err_noparam");
    $data = [];
    $data["modem"] = QQ()->t("modems")->s("*")->w("modemPK=:modemPK")->one($q);
    $data["log"] =  QQ()->t("modem_log")->s("*")->w("modemFK=:modemPK")->all($q);

    $ipaddr = $data["modem"]["ipaddr"];

    exec("/bin/ping -w 2 $ipaddr", $outcome_1, $code);
    $data["ping"] = (0 == $code);

    exec("wg show all dump", $outcome_2, $code);
    // $wgshowstr = "";
    $peerParts = [];
    $peerstr = "";
    foreach ($outcome_2 as $value) {

      if (str_contains($value, $ipaddr . "/")) {
        $peerstr = $value;
        $peerParts = preg_split('/\s+/', $peerstr);
        break;
      }
    }
    $data["wgshow"] = $peerstr;
    if (count($peerParts) >= 6) {
      $data["endpoint"] = $peerParts[3];
      $data["lastTime"] = date('Y-m-d H:i:s', $peerParts[5]);
      $data["dataRx"] = $peerParts[6] / 1024;
      $data["dataTx"] = $peerParts[7] / 1024;
    }
    exec("dmesg --time-format iso | grep wireguard", $outcome_3, $code);


    $data["wglogs"] = $data["wgshow"] . "\n";
    if ($data["wgshow"] != "" && isset($data["endpoint"])) {
      foreach ($outcome_3 as $key => $line) {
        if (!str_contains($line, $data["endpoint"]))  continue;
        $start =   strpos($line, 'peer');
        $finish = strpos($line, '(');
        $peer = substr($line, $start, $finish - $start - 1);
        break;
        // $data["wglogs"] .= preg_replace("/peer \d+/", $data["modem"]["cName"], $line) . "\n";
      }

      if (isset($peer))
        foreach ($outcome_3 as $key => $line) {
          if (!str_contains(strtolower($line), $peer))  continue;
          $data["wglogs"] .= $line . "\n";
        }
    }

    phpH::json($data);
  }
}
