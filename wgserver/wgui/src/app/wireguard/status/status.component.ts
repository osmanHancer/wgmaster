import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MySharedModules } from '../../_com/myshared.module';
import { WGService } from '../../_lib/WGService';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { MatSort,Sort } from '@angular/material/sort';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [CommonModule, MySharedModules],
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
})
export class StatusComponent {


  pingstatus!: boolean;

  wglog!: any;
  modemPK!: string | null;
  dataSource = new MatTableDataSource();
  @ViewChild('empTbSort') empTbSort = new MatSort();
  client = {
    cName: '',
    ipaddr: '',
    loginTime: '',
    lastTime: '',
    pubKey: '',
    endpoint: '',
    rx:NaN,
    tx:NaN,
    TxRxTotal:'',
    diffHour:'',
    avgUsage:''
  };
  progress=-1;



  constructor(private route: ActivatedRoute, private wgService: WGService) {

  }

  async ngOnInit() {
    this.modemPK = this.route.snapshot.paramMap.get('modemPK');

    await this.refresh();
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.empTbSort;
  }

  async refresh() {

  if(this.progress>0) this.progress=1;

    const data = await this.wgService.getClientStatus(this.modemPK);
    this.dataSource.data = [... data.log];
    this.pingstatus = data.ping;
    this.wglog=data.wglogs;
    this.client.endpoint=data.endpoint;
    this.client.cName = data['modem']['cName'];
    this.client.ipaddr = data['modem']['ipaddr'];
    this.client.loginTime = data['modem']['lastTry'];
    this.client.lastTime = data['lastTime'];
    this.client.pubKey = data['modem']['PublicKey'];
    if(data.dataRx!=undefined){
    this.client.rx=+data.dataRx.toFixed(2);
    this.client.tx=+data.dataTx.toFixed(2);
    this.client.TxRxTotal=(+data.dataTx+ +data.dataTx).toFixed(2);
    let now=new Date();
    let lastTime=Date.parse(this.client.lastTime);
    console.log(this.client.lastTime);
    this.client.diffHour=((now.getTime() - lastTime)/1000/60/60).toFixed(2);
    this.client.avgUsage=(+this.client.TxRxTotal/+this.client.diffHour).toFixed(2);
    }
 this.progress=2;
    // data["modem"]["ipaddr"]
  }

  async delpubk(){
    if (confirm('Silmek istediğinizden emin misiniz? Bağlantı kopacak')) {
    const data = await this.wgService.updatepubk("pkupdate",this.modemPK,this.client.pubKey);
    this.refresh();
  }
  }


}
