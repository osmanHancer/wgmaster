import { Component, ViewChild } from '@angular/core';
import { MySharedModules } from 'src/app/_com/myshared.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ModbusService } from 'src/app/_lib/ModbusService';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'app-pools',
  standalone: true,
  imports: [MySharedModules],
  templateUrl: './pools.component.html',
  styleUrls: ['./pools.component.scss']
})
export class PoolsComponent {
  dataSource = new MatTableDataSource();
  jsondata:any;
  columns: any;
  str :any;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private _snackBar: MatSnackBar,private modbusService:ModbusService) {
  }
   async ngOnInit() {


    const json=await this.modbusService.getPools();
    this.dataSource.data= json;

  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  valuechange(searchValue: any): void {
    this.dataSource.filter=searchValue;
  }
}
