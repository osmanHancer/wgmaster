import { Component } from '@angular/core';
import { MySharedModules } from 'src/app/_com/myshared.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QW } from 'src/app/_lib/qw.helper';

import { MatTableDataSource } from '@angular/material/table';
import { WGService } from 'src/app/_lib/WGService';


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


  constructor(private _snackBar: MatSnackBar,private wgService:WGService) {}
   async ngOnInit() {


    const json=await this.wgService.getlist();
    this.dataSource.data= json;


  }

  valuechange(searchValue: any): void {
    this.dataSource.filter=searchValue;
  }


}


