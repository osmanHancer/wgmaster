import { Component } from '@angular/core';
import { MySharedModules } from 'src/app/_com/myshared.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [MySharedModules],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {

  innerWidth: number;

  constructor(
    private router: Router,

  ) {
    this.innerWidth = window.innerWidth;
  }

  setActiveMenu(path: any) {
    return this.router.url.includes(path) ? 'active-menu' : '';

  }
}
