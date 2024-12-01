import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MySharedModules } from 'src/app/_com/myshared.module';
import { QW } from 'src/app/_lib/qw.helper';
import { ActivatedRoute } from '@angular/router';
import { ModbusService } from 'src/app/_lib/ModbusService';
@Component({
  selector: 'app-deviceedit',
  standalone: true,
  imports: [CommonModule, MySharedModules],
  templateUrl: './deviceedit.component.html',
  styleUrls: ['./deviceedit.component.scss']
})
export class DeviceeditComponent {
  pools: any;


  async submitForm(action: string) {
    let data = await this.modbusService.saveDevice(action, this.editItem);

  }
  public editItem: edititem = {
    id: '', host: '', port: '', host2: '', port2: '', slaveid: '1', wordBlock: '16', wordBlockMAx: '112', bitBlock: '64',
    bitBlockMax: '256', scanPeriod: '1000', pool_id: '', requestTimeout: '3000', svcid: '1', connectTimeout: '', state:'' , type: '', info: ''
  };
  selectedValue: any;

  selected: any;
  isButtonVisible: any;
  constructor(private route: ActivatedRoute, private modbusService: ModbusService) {


  }
  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') ?? "-1";
    this.isButtonVisible = (id == "-1") ? false : true;
    this.pools = await QW.json('/svcModbus/getPools');
    this.pools = this.pools.data;
    if(id!="-1"){
    const fd = new FormData();
    fd.append("id", id);
    let json = await QW.json('/svcModbus/getDevice', fd);
    console.log(json);

    this.editItem = json.data;

      this.editItem.state=this.editItem.state.toString();
      this.editItem.type=this.editItem.type.toString();
    }
  }
}
type edititem = {
  id: string
  host: string
  port: string
  host2: string
  port2: string
  slaveid: string
  wordBlock: string
  wordBlockMAx: string
  bitBlock: string
  bitBlockMax: string
  scanPeriod: string
  pool_id: string
  requestTimeout: string
  svcid: string
  connectTimeout: string
  state: string
  type: string
  info: string
}
interface Pool {
  value: string;
  viewValue: string;
}
