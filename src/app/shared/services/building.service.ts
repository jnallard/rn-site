import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { BaseProxyService } from './base-proxy.service';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class BuildingService extends BaseProxyService {

  constructor(httpClient: HttpClient, settings: SettingsService) {
    super(httpClient, settings);
  }

  getStationBuildings(userId: string) {
    const param = `["${userId}"]`;
    const urlQueryPath = 'interface=BuildingInterface&method=getBuildings&short=96';
    return this.get<any>(urlQueryPath, param).pipe(map((response: {type: number, level: number}[]) => {
      return response.map(row => ({level: +row.level, id: +row.type}));
    }));
  }
}
