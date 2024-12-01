import { Component, Injectable, ViewChild } from '@angular/core';
import { WGService } from 'src/app/_lib/WGService';
import { MySharedModules } from 'src/app/_com/myshared.module';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { QWTime } from 'src/app/_lib/qw.time';

@Component({
  selector: 'app-log',
  standalone: true,
  imports: [MySharedModules],
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss'],
  providers: [DatePipe],

})
export class LogComponent {
  dataSource = new MatTableDataSource();
  fullData!: any[]
  str: any;
  @ViewChild(MatSort) sort!: MatSort;
  filterForm = new FormGroup({
    fromDate: new FormControl(),
    toDate: new FormControl(),
  });
  dateStart: string;
  dateEnd: string;

  constructor(private wgService: WGService, private datepip: DatePipe
  ) {
    let dt = new Date();
    this.dateStart = QWTime.DT2Input(dt, true, -30);
    this.dateEnd = QWTime.DT2Input(dt, true, +1);
    this.filterForm.get("fromDate")?.setValue(this.dateStart);
    this.filterForm.get("toDate")?.setValue(this.dateEnd);

  }
  async ngOnInit() {
    this.fullData = await this.wgService.modemlog();

    this.dataSource.data = [...this.fullData];
    await this.getDatesql(this.filterForm.value);
    // QW.showSnack(this._snackBar,,2000)
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  filtervaluechange(searchValue: string): void {
    this.dataSource.filter = searchValue;
  }


  async getDatesql(value: any) {
    const fromDate = value.fromDate;
    let from_date = this.datepip.transform(fromDate, 'yyyy-MM-dd');
    const toDate = value.toDate;
    let latest_date = this.datepip.transform(toDate, 'yyyy-MM-dd');


    const data = await this.wgService.modemlog(from_date, latest_date);

    this.dataSource.data = data;


  }
}



