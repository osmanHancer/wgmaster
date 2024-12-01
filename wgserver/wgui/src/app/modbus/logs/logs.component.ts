import { Component, ViewChild } from '@angular/core';
import { MySharedModules } from 'src/app/_com/myshared.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ModbusService } from 'src/app/_lib/ModbusService';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { QWTime } from 'src/app/_lib/qw.time';
@Component({
  selector: 'app-pools',
  standalone: true,
  imports: [MySharedModules],
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
  providers: [DatePipe],
})
export class LogsComponent {

  filterForm = new FormGroup({
    fromDate: new FormControl(),
    toDate: new FormControl(),
  });
  dateStart: string;
  dateEnd: string;


  dataSource = new MatTableDataSource();
  jsondata: any;
  columns: any;
  str: any;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private _snackBar: MatSnackBar, private modbusService: ModbusService, private datepip: DatePipe) {
    let dt = new Date();
    this.dateStart = QWTime.DT2Input(dt, true, -30);
    this.dateEnd = QWTime.DT2Input(dt, true, +1);
    this.filterForm.get("fromDate")?.setValue(this.dateStart);
    this.filterForm.get("toDate")?.setValue(this.dateEnd);
  }
  async ngOnInit() {


    const json = await this.modbusService.getLogs();
    this.dataSource.data = json;

  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  valuechange(searchValue: any): void {
    this.dataSource.filter = searchValue;
  }

  async getDatesql(value: any) {
    const fromDate = value.fromDate;
    let from_date = this.datepip.transform(fromDate, 'yyyy-MM-dd');
    const toDate = value.toDate;
    let latest_date = this.datepip.transform(toDate, 'yyyy-MM-dd');


    const data = await this.modbusService.getLogs(from_date, latest_date);

    this.dataSource.data = data;


  }
}
