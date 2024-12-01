SET WG_PATH=C:\KAPPS\WireGuard\
SET WG_CONF=%WG_PATH%Data\wg0.conf
rem %WG_PATH%wireguard.exe /uninstalltunnelservice wg0
%WG_PATH%wireguard.exe /installtunnelservice "%WG_CONF%"
sc.exe config WireGuardTunnel$wg0  start=delayed-auto
reg add HKLM\Software\WireGuard /v LimitedOperatorUI /t REG_DWORD /d 1 /f
reg add HKLM\Software\WireGuard /v DangerousScriptExecution /t REG_DWORD /d 1 /f
)


rem wireguard /dumplog > log.log
rem PS C:\KAPPS\WireGuard\wireguard /dumplog /tail | select