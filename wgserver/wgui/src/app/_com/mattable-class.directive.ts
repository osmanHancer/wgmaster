
/*
Statik ve klasik bir tabloyu mat table stiline dönüştüren directive
MatAll modülüne dahil edildi
*/
import { Directive, ElementRef} from '@angular/core';

@Directive({
  selector: '[mymattable]',
})
export class MattableClassDirective {


  constructor(private elementRef: ElementRef) {
  }
  ngAfterViewInit() {
    let el= this.elementRef.nativeElement as HTMLElement;
    el.classList.add("mat-mdc-table")
    let eltr=el.querySelectorAll("tr");
    eltr.forEach(element => {
      element.classList.add("mdc-data-table__row");
    });
    let eltd=el.querySelectorAll("td");
    eltd.forEach(element => {
      element.classList.add( "mdc-data-table__cell");
    });
  }
}
