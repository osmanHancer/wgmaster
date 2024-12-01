import { Injectable } from '@angular/core';
import { QW } from './qw.helper';
@Injectable({
  providedIn: 'root',
})
export class WGService {

  formdata!: any;

  async getlist() {
    let json = await QW.json('/svcWg/modemlist');
    return json.data;

  }
  async getClientStatus(modemPK: any) {
    const fd = new FormData();
    fd.append('modemPK', modemPK);
    let json = await QW.json('/svcWg/getClientStatus', fd);
    return json.data;
  }

  async modemlog(from: any = null, to: any = null) {
    const fd = new FormData();
    if (from) fd.append('from', from);
    if (to) fd.append('to', to);
    let json = await QW.json('/svcWg/modemlog', fd);
    return json.data;
  }

  async save(action: any, obj: any) {

    const fd = new FormData();
    if (action != 'delete') {

      fd.append('cName', obj.cName);
      fd.append('passw', obj.passw);
      fd.append('ipaddr', obj.ipaddr);
      fd.append('modemPK', obj.modemPK);
      fd.append('_action', action);
    } else {

      fd.append('modemPK', obj.modemPK);
      fd.append('_action', action);
    }

    let json = await QW.json('/svcWg/setModem', fd);
    return json.data;
  }
  async updatepubk(action: any, modempk: any, oldPublicKey: any) {


    const fd = new FormData();

    fd.append('modemPK', modempk);
    fd.append('_oldPublicKey', oldPublicKey);
    fd.append('PublicKey', "");
    fd.append('_action', action);
    let json = await QW.json('/svcWg/setModem', fd);
    return json;
  }
  async wgWinConf(cName: any, passw: any, fw: any) {
    const fd = new FormData();
    fd.append('cName', cName);
    fd.append('passw', passw);
    fd.append('FW', fw);
    let text = await QW.text('/wgClient/get', fd);

    return text;
  }
  async getNewIp() {
    let json = await QW.json('/svcWg/getNewIp');
    return json.data;
  }

}
