# RUN
docker-compose up --build 

# CONFIG
WG ip block set from  init_sv.sh like :
ip_block="172.33.0"

WG client config init_client.sh :
wg_sv_host=192.168.0.20

# REMOVE PEER
 wg set wg0 peer PUBLİC_KEY remove
 wg set wg0 peer I5IHTWCwxAUiy0QpL9I/sp4BiNdfrbFAJY1XdK3kvnw= remove

# PROBLEM
PROBLEM CMD mounted sh file 
exec /wg/init_client.sh: no such file or directory
VS code > open init_client.sh  > bottom right > CRLF change to LF

# NOTE
test.sh for testing learning  bash scripting
client config files store container with first start.
wg log ?


## wireguard log
- enable log module from wireguard 

  - `echo "module wireguard +p" | sudo tee /sys/kernel/debug/dynamic_debug/control` 
- show wireguard logs

  - `sudo dmesg -wT | grep wireguard` 
## wireguard errors
- Server tarafında peer olarak kayıtlı ama client olarak ayakta olmayan ip ye ping 

  - `ping: sendmsg: Hedef adres gerekli -- Destination host unreachable`

  - (logs) `No valid endpoint has been configured or discover for peer ... `
- Client wrong public key

   - `Invalid MAC of handshake, dropping packet`
- Client wrong private key

  - `invalid handshake initiation`
- Server tarafında kayıtlı olmayan ip ye ping

  - (logs)`No peer has allowed IPs matching (ip)`

  - `ping: sendmsg: Required key not available -- Destination host unreachable`

- Server tarafında peerin public anahtarını yanlış girmek

  -(logs)`Invalid handshake initiation from (ip):(port)`

- Server conf dosyasında peer e yanlış ip verme

  -(logs)`Packet has unallowed src IP (....) from peer ...`
## windows wsl network problem
windows wsl docker wireguard networking not working outside.
must run ubuntu inside and :

 add wgserver 
     volumes:
      ...
      - /lib/modules:/lib/modules


##  Run WSL Ubuntu 
- Install ubuntu 22 from windows store 
- Open Docker Desktop / Settings / Resources / Activate: Ubuntu 22 /save apply
- Open VScode (install docker, remote explorer extension), remote explorer / ubuntu22  / connect wsl //wait installing
- ubuntu terminal docker compose up --build
- VS code : open folder  /mnt/c/Users/KML/Desktop/WORKS/Docker/wgmaster/ 
- netsh interface portproxy add v4tov4 listenport=4000 listenaddress=0.0.0.0 connectport=4000 connectaddress=<<ubuntu wsl ip addr>>

## for angular  
### docker windows code linting
install your pc nodejs for code linting :
cd ./wgserver/wgui

npm  i esbuild-windows-64 --no-save
### yeni sayfa oluşturma
ng g c home --standalone
sonra routes.ts içine ekle

### yapı
parça componentler _com içinde
yardımcı mmethodlar _lib içinde
app.component.* herşeyin başladığı yer.
app.component.html içindeki <router-outlet> diğer sayfalaara route(gidince) olunca  buraya yüklenir.
bu projede bütün componentler standalone. yani birşeyi import etmek için component.ts import içine eklemek gerek.
