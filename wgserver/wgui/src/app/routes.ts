
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'wg',
    pathMatch: 'full'
  },
  {
    path: 'wg',
    loadComponent: () => import('./wireguard/_layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./wireguard/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'edit/:modemPK',
        loadComponent: () => import('./wireguard/edit/edit.component').then(m => m.EditComponent)
      },
      {
        path: 'log',
        loadComponent: () => import('./wireguard/log/log.component').then(m => m.LogComponent)
      },
      {
        path: 'status/:modemPK',
        loadComponent: () => import('./wireguard/status/status.component').then(m => m.StatusComponent)
      },
    ]
  }, //wg
  {
    path: 'modbus',
    loadComponent: () => import('./modbus/_layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./modbus/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'home/deviceedit/:id',
        loadComponent: () => import('./modbus/home/deviceedit/deviceedit.component').then(m => m.DeviceeditComponent)
      },
      {
        path: 'home/devicetags/:id',
        loadComponent: () => import('./modbus/home/devicetags/devicetags.component').then(m => m.DevicetagsComponent)
      },
      {
        path: 'pools',
        loadComponent: () => import('./modbus/pools/pools.component').then(m => m.PoolsComponent)
      },
      {
        path: 'pools/poolsedit/:id',
        loadComponent: () => import('./modbus/pools/poolsedit/poolsedit.component').then(m => m.PoolseditComponent)
      },
      {
        path: 'pools/pooltags/:id',
        loadComponent: () => import('./modbus/pools/pooltags/pooltags.component').then(m => m.PooltagsComponent)
      },
      {
        path: 'pools/pooltags/pooltagsedit/:name/:did',
        loadComponent: () => import('./modbus/pools/pooltagsedit/pooltagsedit.component').then(m => m.PooltagseditComponent)
      },
      {
        path: 'home/devicetags/devicetagsedit/:did/:name',
        loadComponent: () => import('./modbus/home/devicetagsedit/devicetagsedit.component').then(m => m.DevicetagseditComponent)
      },
      {
        path: 'logs',
        loadComponent: () => import('./modbus/logs/logs.component').then(m => m.LogsComponent)
      },

    ]
  }, //modbus


]
