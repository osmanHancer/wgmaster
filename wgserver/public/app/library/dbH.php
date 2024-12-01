<?php

class dbH
{
  public static function dbLogin($q)
  {
    $db = dbC::getDB();
    $modem = $db->one("SELECT * FROM modems
    WHERE cName=:cName AND passw=:passw
    LIMIT 1;", $q);

    if (!isset($modem["modemPK"]))
      return "db_not_auth";
    $q["FW"] = $q["FW"] ?? "";

    $q['remoteAddr'] = $_SERVER['REMOTE_ADDR'];
    $q['modemPK'] = $modem["modemPK"];
    $db->set("
    INSERT INTO  modem_log 
    SET modemFK='$q[modemPK]',cName='$q[cName]', action='login', msg='FW=$q[FW]', remoteAddr='$q[remoteAddr]';
    ", $q);

    return $modem;
  }

  public static function setKeys($q)
  {
    $db = dbC::getDB();

    $result = $db->set("
        UPDATE modems SET lastTry=NOW(),PrivateKey=:PrivateKey, PublicKey=:PublicKey
        WHERE cName=:cName 
        LIMIT 1;
    ",$q);
    return $result;
  }
 public  static  function getRandomString($n)
  {
      $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      $randomString = '';
  
      for ($i = 0; $i < $n; $i++) {
          $index = rand(0, strlen($characters) - 1);
          $randomString .= $characters[$index];
      }
  
      return $randomString;
  }
}
