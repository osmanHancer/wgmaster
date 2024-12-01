-- --------------------------------------------------------
-- Sunucu:                       127.0.0.1
-- Sunucu sürümü:                8.0.32 - MySQL Community Server - GPL
-- Sunucu İşletim Sistemi:       Linux
-- HeidiSQL Sürüm:               12.3.0.6589
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- dbwg için veritabanı yapısı dökülüyor
CREATE DATABASE IF NOT EXISTS `dbwg` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `dbwg`;

-- yöntem yapısı dökülüyor dbwg.addModem
DELIMITER //
CREATE PROCEDURE `addModem`(
	IN `in_cName` VARCHAR(50),
	IN `in_ipaddr` VARCHAR(50)
)
BEGIN
	SET @newsalt= randStr(8,0);
	SET @newpassw=randStr(12,0);
	SET @newhash= SHA2(CONCAT(@newsalt,@newpassw),384);
	SET @ipaddr=in_ipaddr;
	INSERT INTO `dbwg`.`modems` SET cName=in_cName, passw=@newpassw, passHash=@newhash,passSalt=@newsalt, ipaddr=@ipaddr;
	
END//
DELIMITER ;

-- olay yapısı dökülüyor dbwg.evDaily
DELIMITER //
CREATE EVENT `evDaily` ON SCHEDULE EVERY 1 DAY STARTS '2022-10-25 09:22:45' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
	DELETE FROM  modem_log  WHERE UNIX_TIMESTAMP(createdTime)<UNIX_TIMESTAMP()-3600*24*30;

END//
DELIMITER ;

-- tablo yapısı dökülüyor dbwg.modems
CREATE TABLE IF NOT EXISTS `modems` (
  `modemPK` int NOT NULL AUTO_INCREMENT,
  `cName` varchar(50) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL,
  `passw` varchar(100) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL,
  `passHash` varchar(128) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL,
  `passSalt` varchar(12) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL,
  `ipaddr` varchar(50) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL,
  `SN` varchar(50) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL,
  `FW` varchar(50) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL,
  `lastTry` timestamp NULL DEFAULT NULL,
  `PrivateKey` varchar(50) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL,
  `PublicKey` varchar(50) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL,
  `info` varchar(50) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL,
  `createdTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`modemPK`),
  UNIQUE KEY `clientName` (`cName`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=ascii COLLATE=ascii_bin;

-- dbwg.modems: ~3 rows (yaklaşık) tablosu için veriler indiriliyor
INSERT INTO `modems` (`modemPK`, `cName`, `passw`, `passHash`, `passSalt`, `ipaddr`, `SN`, `FW`, `lastTry`, `PrivateKey`, `PublicKey`, `info`, `createdTime`) VALUES
	(0, 'root', '', '', '', '172.33.0.1', '', '', '', '', '', NULL, '2022-10-14 06:00:00'),
	(1, 'u_wgclient1', 'dZLnfdfxPdffhvfOSdfs3gYqogBGs', 'a573cd349cf31774ac2dfb8e29f071a761924c87c4606df570fce4f4abc73014a4bfa8d00ab8746b7a9ec5f0130f72f0', 'lT3p2fE94uJq', '172.33.0.77', '1108921255', 'RUT2_R_00.07.02.7', '2023-02-23 09:17:19', 'cDfHxbkHFTl6joLHt2p0F5WNvqOHdsnonWQzgibc9HA=', 'I5IHTWCwxAUiy0QpL9I/sp4BiNdfrbFAJY1XdK3kvnw=', NULL, '2022-10-14 06:00:00'),
	(2, 'u_wgclient2', 'dZLnfdfxPdffhvfOSdfs3gYqogBGs', 'a44d85374a4d9e0eb4f87cea8ab361ad3ed1d7b1e329d910444381c207f6909d7f51a667f3fdc6a23616d21d2d886eca', 'HqPXTiBjAddJ', '172.33.0.78', '1108916272', 'RUT2_R_00.07.02.4', '2023-02-23 10:05:04', 'aALInfjotdnNbELxcIed9EjHM0aiB3Kg0iTVu40AC2k=', 'ztO1ZvH34P8ckjqwCx2pAoSaDyw8RP19v+DBCf0d7BE=', NULL, '2022-10-14 06:00:00'),
	(3, 'u_wgclient3', 'dZLnfdfxPdffhvfOSdfs3gYqogBGs', 'bdcc38d3690a9037aae259853913588d38e795b2010386f1ff393fc287863b1b27ac3727e962aae2323bea9f78378e28', 'HqPXTiBjAddJ', '172.33.0.10', 'teltonika', NULL, '2022-11-03 11:18:40', NULL, NULL, NULL, '2022-10-24 06:00:00');

-- tablo yapısı dökülüyor dbwg.modem_log
CREATE TABLE IF NOT EXISTS `modem_log` (
  `modemFK` int unsigned DEFAULT NULL,
  `cName` varchar(50) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL,
  `action` varchar(50) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL,
  `msg` varchar(254) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL,
  `remoteAddr` varchar(50) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL,
  `time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `createdTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=ascii COLLATE=ascii_bin;

-- dbwg.modem_log: ~5 rows (yaklaşık) tablosu için veriler indiriliyor
INSERT INTO `modem_log` (`modemFK`, `cName`, `action`, `msg`, `remoteAddr`, `time`, `createdTime`) VALUES
	(1, 'u_wgclient1', 'login', 'FW=', '172.20.0.5', '2023-02-23 09:17:19', '2023-02-23 09:17:19'),
	(2, 'u_wgclient2', 'login', 'FW=', '172.20.0.4', '2023-02-23 09:17:53', '2023-02-23 09:17:53'),
	(2, 'u_wgclient2', 'login', 'FW=', '172.20.0.4', '2023-02-23 09:18:32', '2023-02-23 09:18:32'),
	(2, 'u_wgclient2', 'login', 'FW=', '172.20.0.4', '2023-02-23 10:01:59', '2023-02-23 10:01:59'),
	(2, 'u_wgclient2', 'login', 'FW=', '172.20.0.4', '2023-02-23 10:05:04', '2023-02-23 10:05:04');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
