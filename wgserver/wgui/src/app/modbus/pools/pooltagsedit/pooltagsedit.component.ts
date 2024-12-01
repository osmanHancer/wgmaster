import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MySharedModules } from 'src/app/_com/myshared.module';
import { QW } from 'src/app/_lib/qw.helper';
import { ActivatedRoute } from '@angular/router';
import { ModbusService } from 'src/app/_lib/ModbusService';
import { Action } from 'rxjs/internal/scheduler/Action';
@Component({
  selector: 'app-pooltagsedit',
  standalone: true,
  imports: [CommonModule, MySharedModules],
  templateUrl: './pooltagsedit.component.html',
  styleUrls: ['./pooltagsedit.component.scss']
})

export class PooltagseditComponent {
  public editItem: Poolstag = { did: '', name: '', addr: '', dataType: { id: "", name: "" }, factor: '', func: '', scanRate: '', state: 0, info: '' };
  isButtonVisible: any;
  dataTypes: any;
  selected:any;

  constructor(private route: ActivatedRoute,private modbusService:ModbusService) {


  }
  async ngOnInit() {
    if(this.route.snapshot.paramMap.get('did')=="-1")
    this.isButtonVisible=false;
    else
    this.isButtonVisible=true;

    const fd = new FormData();
    fd.append('did', this.route.snapshot.paramMap.get('did') ?? "-1");
    fd.append('name', this.route.snapshot.paramMap.get('name') ?? "-1");
    let json = await QW.json('/svcModbus/getPoolTag', fd)
    if (json.data == false) this.editItem.did = this.route.snapshot.paramMap.get('name') ?? "-1";
    else
      this.editItem = json.data;

    let data = await QW.json('/svcModbus/getDataType');
    this.dataTypes = data.data
    this.dataTypes.forEach((element: any) => {
      if (this.editItem.dataType == element.id)
        this.editItem.dataType=element;

        this.selected=this.editItem.state.toString();

    });


  }
  public async submitForm(action: string) {
   (this.editItem.dataType.id);
    if(this.selected==10)
    this.editItem.state=10;
    else
    this.editItem.state=0;
    let data = await this.modbusService.setPoolTags(action,this.editItem);

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
  state: number
  info: string

}
type tip = {
  id: string
  name: string
}
