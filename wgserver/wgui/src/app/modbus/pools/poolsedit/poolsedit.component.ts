import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MySharedModules } from 'src/app/_com/myshared.module';
import { ActivatedRoute } from '@angular/router';
import { QW } from 'src/app/_lib/qw.helper';
import { ModbusService } from 'src/app/_lib/ModbusService';

type Modem = {
  id: string
  name: string
  version: string
  refPool: string
  description: string
}

@Component({
  selector: 'app-poolsedit',
  standalone: true,
  imports: [CommonModule, MySharedModules],
  templateUrl: './poolsedit.component.html',
  styleUrls: ['./poolsedit.component.scss']
})
export class PoolseditComponent {

  public editItem: Modem = { id: '', name: '', version: '', refPool: '', description: '' };
  refPool: any;
  isButtonVisible: boolean=true;

  constructor(private route: ActivatedRoute,private modbusService:ModbusService) {

  }
  async ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id') ?? "-1";
    console.log(id);
    if (id == "-1") { this.isButtonVisible = false }
    else this.isButtonVisible = true;
    const fd = new FormData();
    fd.append("id", id);
    const json = await QW.json("/svcModbus/getPool", fd)
    if (json.data != false)
      this.editItem = json.data;



  }

  public async submitForm(action: string) {
     let data = await this.modbusService.savePool(action,this.editItem);
    console.log(this.editItem);
  }


}
