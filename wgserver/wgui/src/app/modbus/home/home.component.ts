import { Component, ViewChild } from '@angular/core';
import { MySharedModules } from 'src/app/_com/myshared.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ModbusService } from 'src/app/_lib/ModbusService';
import { MatSort } from '@angular/material/sort';
import { QW } from 'src/app/_lib/qw.helper';


@Component({
  selector: 'app-home',
  standalone: true,
  // changeDetection:ChangeDetectionStrategy.OnPush,
  imports: [MySharedModules],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent  {
  dataSource = new MatTableDataSource();
  jsondata:any;
  columns: any;
  str :any;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private _snackBar: MatSnackBar,private modbusService:ModbusService) {

  }
   async ngOnInit() {


    const json=await this.modbusService.getDevices();
    this.dataSource.data= json;



  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  exportData() {
    QW.getCSV(this.dataSource.filteredData, "devices");
  }

  valuechange(searchValue: any): void {
    this.dataSource.filter=searchValue;
  }

}


