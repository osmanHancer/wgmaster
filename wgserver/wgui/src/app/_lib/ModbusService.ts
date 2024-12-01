import { Injectable } from '@angular/core';
import { QW } from './qw.helper';
@Injectable({
  providedIn: 'root',
})
export class ModbusService {

  formdata!: any;

  async getDevices() {
    let json = await QW.json('/svcModbus/getDevices');
    return json.data;

  }
  async getPools() {
    let json = await QW.json('/svcModbus/getPools');
    return json.data;

  }
  async getLogs(from: any = null, to: any = null) {
    const fd = new FormData();
    if (from) fd.append('from', from);
    if (to) fd.append('to', to);
    let json = await QW.json('/svcModbus/getLogs',fd);
    return json.data;

  }
  async getPoolTags(id: string) {
    const fd = new FormData();
    fd.append('did', id);
    let json = await QW.json('/svcModbus/getPoolTags', fd);
    return json.data;

  }
  async getDeviceTags(id: string) {
    const fd = new FormData();
    fd.append('did', id);
    let json = await QW.json('/svcModbus/getDeviceTags', fd);
    return json.data;

  }
  async savePool(action: any, obj: any) {

    const fd = new FormData();
    if (action != 'delete') {

      fd.append('id', obj.id);
      fd.append('name', obj.name);
      fd.append('version', obj.version);
      fd.append('refPool', obj.refPool);
      fd.append('description', obj.description);
      fd.append('_action', action);
    } else {

      fd.append('id', obj.id);
      fd.append('_action', action);
    }

    let json = await QW.json('/svcModbus/setPool', fd);
    return json.data;
  }
  async setPoolTags(action: any, obj: any) {

    const fd = new FormData();
    if (action != 'delete') {

      fd.append('did', obj.did);
      fd.append('name', obj.name);
      fd.append('addr', obj.addr);
      fd.append('dataType', obj.dataType.id);
      fd.append('factor', obj.factor);
      fd.append('func', obj.func);
      fd.append('scanRate', obj.scanRate);
      fd.append('state', obj.state);
      fd.append('info', obj.info);
    } else {

      fd.append('did', obj.did);
      fd.append('name', obj.name);
      fd.append('_action', action);
    }

    let json = await QW.json('/svcModbus/setPoolTags', fd);
    return json;
  }
  async saveDevice(action: any, obj: any) {

    const fd = new FormData();
    if (action != 'delete') {

      fd.append('id', obj.id);
      fd.append('host', obj.host);
      fd.append('port', obj.port);
      fd.append('host2', obj.host2);
      fd.append('port2', obj.port2);
      fd.append('slaveid', obj.slaveid);
      fd.append('wordBlock', obj.wordBlock);
      fd.append('wordBlockMAx', obj.wordBlockMAx);
      fd.append('bitBlock', obj.bitBlock);
      fd.append('bitBlockMax', obj.bitBlockMax);
      fd.append('scanPeriod', obj.scanPeriod);
      fd.append('requestTimeout', obj.requestTimeout);
      fd.append('svcid', obj.svcid);
      fd.append('connectTimeout', obj.connectTimeout);
      fd.append('pool_id', obj.pool_id);
      fd.append('state', obj.state);
      fd.append('type', obj.type);
      fd.append('info', obj.info);

    } else {

      fd.append('id', obj.id);
      fd.append('_action', action);
    }

    let json = await QW.json('/svcModbus/setDevice', fd);
    return json;
  }
  async saveDeviceTags(action: any, obj: any) {

    const fd = new FormData();
    if (action != 'delete') {

      fd.append('did', obj.did);
      fd.append('name', obj.name);
      fd.append('addr', obj.addr);
      fd.append('dataType', obj.dataType.id);
      fd.append('factor', obj.factor);
      fd.append('func', obj.func);
      fd.append('scanRate', obj.scanRate);
      fd.append('state', obj.state);
      fd.append('info', obj.info);

    } else {
      fd.append('_action', action);
      fd.append('did', obj.did);
      fd.append('name', obj.name);
    }


    let json = await QW.json('/svcModbus/setDeviceTags', fd);
    return json;
  }

}
