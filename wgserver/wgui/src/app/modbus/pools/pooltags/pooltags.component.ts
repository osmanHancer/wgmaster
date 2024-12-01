import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MySharedModules } from 'src/app/_com/myshared.module';
import { MatTableDataSource } from '@angular/material/table';
import { ModbusService } from 'src/app/_lib/ModbusService';
import { ActivatedRoute } from '@angular/router';
import { QW } from 'src/app/_lib/qw.helper';

@Component({
  selector: 'app-poolstags',
  standalone: true,
  imports: [CommonModule,MySharedModules],
  templateUrl: './pooltags.component.html',
  styleUrls: ['./poolstags.component.scss']
})
export class PooltagsComponent {
str: any;
id:any;
editItem: any;
dataSource = new MatTableDataSource();

constructor(private modbusService:ModbusService,private route: ActivatedRoute){


}
async ngOnInit() {

  this.id = this.route.snapshot.paramMap.get('id') ?? "-1";
  const json=await this.modbusService.getPoolTags(this.id);
  this.dataSource.data= json;

}
valuechange(searchValue: any): void {
  this.dataSource.filter=searchValue;
}
exportData() {
  QW.getCSV(this.dataSource.filteredData, "devices");
}
}
