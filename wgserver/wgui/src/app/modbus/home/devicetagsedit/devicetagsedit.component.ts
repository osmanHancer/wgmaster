import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MySharedModules } from 'src/app/_com/myshared.module';
import { QW } from 'src/app/_lib/qw.helper';
import { ActivatedRoute } from '@angular/router';
import { ModbusService } from 'src/app/_lib/ModbusService';

@Component({
  selector: 'app-devicetagsedit',
  standalone: true,
  imports: [CommonModule, MySharedModules],
  templateUrl: './devicetagsedit.component.html',
  styleUrls: ['./devicetagsedit.component.scss']
})
export class DevicetagseditComponent {
  isButtonVisible: any;
  async submitForm(action: string) {

    let data = await this.modbusService.saveDeviceTags(action, this.editItem);

  }
  public editItem: Poolstag = { did: '', name: '', addr: '', dataType: { id: "", name: "" }, factor: '', func: '', scanRate: '', state: '', info: '' };
  dataTypes: any;

  constructor(private route: ActivatedRoute, private modbusService: ModbusService) {


  }
  async ngOnInit() {

    const fd = new FormData();
    fd.append('did', this.route.snapshot.paramMap.get('did') ?? "-1");
    fd.append('name', this.route.snapshot.paramMap.get('name') ?? "-1");
    let json = await QW.json('/svcModbus/getDeviceTag', fd)


    if (json.data == false) this.editItem.did = this.route.snapshot.paramMap.get('did') ?? "-1";
    else
      this.editItem = json.data;
    let data = await QW.json('/svcModbus/getDataType');
    this.dataTypes = data.data
    this.dataTypes.forEach((element: any) => {
      if (this.editItem.dataType == element.id)
        this.editItem.dataType = element;


    });

    this.editItem.state = this.editItem.state.toString();


  }
}
type Poolstag = {
  did: string
  name: string
  addr: string
  dataType: tip
  factor: string
  func: string
  scanRate: string
  state: string
  info: string

}
type tip = {
  id: string
  name: string
}
