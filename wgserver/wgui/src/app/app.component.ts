import { BreakpointObserver } from '@angular/cdk/layout';
import { Component,  ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import {  Router } from '@angular/router';
import { MySharedModules } from './_com/myshared.module';
import { DateAdapter } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QW } from './_lib/qw.helper';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [MySharedModules],
})
export class AppComponent {
  title = 'predixi-ng';
  topMenuItems: any[] = [];
  @ViewChild('leftDrawer') leftDrawer!: MatSidenav;

  innerWidth: number;
  drawerMenu: any;

  constructor(
    private router: Router,
    private observer: BreakpointObserver,
    private _adapter: DateAdapter<any>,
    private _snackBar: MatSnackBar
  ) {
    this._adapter.setLocale('tr');
    QW.snacCtl=this._snackBar;
    this.innerWidth = window.innerWidth;
  }

  setActiveMenu(path: any) {
    return this.router.url.endsWith(path) ? 'active-menu' : '';

  }

  ngAfterViewInit() {
    this.observer.observe(['(max-width: 900px)']).subscribe((res) => {
      this.innerWidth = window.innerWidth;
    });
  }
}
