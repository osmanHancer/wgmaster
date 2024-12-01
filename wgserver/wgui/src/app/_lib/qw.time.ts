import { DatePipe } from '@angular/common';

export class QWTime {
  public static date2Mysql(date: Date, addTime: boolean = false) {
    const dtsplit = date.toISOString().slice(0, 19).split('T');
    return dtsplit[0] + (addTime ? " " + dtsplit[1] : "");
  }

  public static monthLastDate(date: any) {
    let int_d = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return int_d;
  }
  public static monthFirstDate(date: any) {
    let int_d = new Date(date.getFullYear(), date.getMonth(), 1);
    return int_d;
  }
  public static input2Mysql(inputDT: string) {
    if (!inputDT) return '';
    return inputDT.replace('T', ' ');
  }
  public static mysql2Input(mysqlDT: string) {
    if (mysqlDT.indexOf(' ') > 1) return mysqlDT.replace(' ', 'T');
    else return mysqlDT + 'T00:00';
  }
  public static DT2Input(date: Date, dateonly = false, addDay: number = 0) {
    const d = new Date(date.getTime() + date.getTimezoneOffset() * -60 * 1000);
    if (addDay) d.setDate(d.getDate() + addDay);
    const str = d.toISOString();
    if (dateonly) return str.split('T')[0];
    else return str.slice(0, 19);
  }
  public static transform(date: string | number, format: string) {
    return new DatePipe('tr').transform(date, format);
  }
  public static diffDay(first: Date, second: Date) {
    return Math.round(
      (second.getTime() - first.getTime()) / (1000 * 60 * 60 * 24)
    );
  }
  public static s2Date(str: string) {
    if (str.indexOf(' ') > 1 || str.indexOf('T')) return new Date(Date.parse(str));
    else return new Date(Date.parse(str + 'T00:00'));
  }
}
