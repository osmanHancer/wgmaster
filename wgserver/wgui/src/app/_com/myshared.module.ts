
import { CommonModule } from '@angular/common';
import {LOCALE_ID, NgModule} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { MatAllModule } from './mat-all.module';
import { MattableClassDirective } from './mattable-class.directive';
import { HttpClientModule, HttpClient } from '@angular/common/http';



@NgModule({
  imports:[],
  exports: [
    FormsModule, ReactiveFormsModule,CommonModule,RouterModule,MatAllModule,HttpClientModule
    ,
  ],
  declarations:[],
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'tr'},]
})
export class MySharedModules {}
