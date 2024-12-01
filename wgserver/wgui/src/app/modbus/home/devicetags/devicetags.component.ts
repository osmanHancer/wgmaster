
import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MySharedModules } from 'src/app/_com/myshared.module';
import { MatTableDataSource } from '@angular/material/table';
import { ModbusService } from 'src/app/_lib/ModbusService';
import { ActivatedRoute } from '@angular/router';
import { QW } from 'src/app/_lib/qw.helper';


@Component({
  selector: 'app-devicetags',
  standalone: true,
  imports: [CommonModule, MySharedModules],
  templateUrl: './devicetags.component.html',
  styleUrls: ['./devicetags.component.scss']
})
export class DevicetagsComponent {
  str: any;
  hidden!: boolean;
  id: any;
  constructor(private modbusService: ModbusService, private route: ActivatedRoute) {
  }


  async ngOnInit() {

     this.id = this.route.snapshot.paramMap.get('id') ?? "-1";
    const json = await this.modbusService.getDeviceTags(this.id);
    if (json.length != 0) {
      this.dataSource.data = json;
      this.hidden = false;
    }
    else {
      this.hidden = true;

    }
  }
  valuechange(searchValue: any): void {
    this.dataSource.filter = searchValue;
  }
  exportData() {
    QW.getCSV(this.dataSource.filteredData, "devices");
  }
  dataSource = new MatTableDataSource();

}
