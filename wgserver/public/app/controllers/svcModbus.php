
<?php
define('DB_DB', 'dbmymodbus');

class SvcModbusC extends Q_Controller
{

  function _init()
  {
    header("Access-Control-Allow-Origin: *");
    $this->apiEnable();
  }
  public function getDevices()
  {
    $data = QQ()->t("devices d")->j("pool_types pt", "pool_id=pt.id")->s("d.*,pt.name")->all();
    phpH::json($data);
  }
  public function getDevice()
  {
    $q = $_POST;
    $data = QQ()->t("devices")->s("*")->w("id=:id")->one($q);
    phpH::json($data);
  }
  public function setDevice()
  {
    $q = $_POST;

    if ($q["_action"] != "delete")
      $data = QQ()->t('devices')->ins($q, dubUpdate: true);
    else
      $data = QQ()->t("devices")->w("id=:id")->del($q, getSql: false);
    phpH::json($data);
  }
  public function setDeviceTags()
  {
    $q = $_POST;

    if ($q["_action"] != "delete")
      $data = QQ()->t('devices_tags')->ins($q, dubUpdate: true);
    else
      $data = QQ()->t("devices_tags")->w("did=:did and name=:name")->del($q, getSql: false);
    phpH::json($data);
  }
  public function getPools()
  {
    $data = QQ()->t("pool_types")->s("*")->all();
    phpH::json($data);
  }
  public function getPool()
  {
    $q = $_POST;
    $data = QQ()->t("pool_types")->s("*")->w("id=:id")->one($q);
    phpH::json($data);
  }
  public function setPool()
  {
    $q = $_POST;
    if ($q["_action"] != "delete")
      $data = QQ()->t('pool_types')->ins($q, dubUpdate: true);
    else
      $data = QQ()->t("pool_types")->w("id=:id ")->del($q, getSql: false);
    phpH::json($data);
  }
  public function setPoolTags()
  {
    $q = $_POST;

    if ($q["_action"] != "delete")
      $data = QQ()->t('pool_tags')->ins($q, dubUpdate: true);
    else
      $data = QQ()->t("pool_tags")->w("did=:did and name=:name")->del($q, getSql: false);
    phpH::json($data);
  }
  public function getLogs()
  {
    $q = $_POST;
    $stm = QQ()->t("_log_data")->s("*")->o("time DESC");
    if (isset($q["from"]) && isset($q["to"]))
      $data = $stm->w("time BETWEEN :from AND :to")->all($q);
    else
      $data = $stm->all();
    phpH::json($data);
  }
  public function getPoolTags()
  {
    $q = $_POST;
    $data = QQ()->t("pool_tags")->s("*")->w("did=:did")->all($q);
    phpH::json($data);
  }
  public function getDeviceTags()
  {
    $q = $_POST;
    $data = QQ()->t("devices_tags")->s("*")->w("did=:did")->all($q);
    phpH::json($data);
  }
  public function getPoolTag()
  {
    $q = $_POST;
    $data = QQ()->t("pool_tags")->s("*")->w("did=:did and name=:name")->one($q);
    phpH::json($data);
  }
  public function getDeviceTag()
  {
    $q = $_POST;
    $data = QQ()->t("devices_tags")->s("*")->w("did=:did and name=:name")->one($q);
    phpH::json($data);
  }
  public function getDataType()
  {
    $q = $_POST;
    $data = QQ()->t("data_types")->s("id,name")->all($q);
    phpH::json($data);
  }
}
