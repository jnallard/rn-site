import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { CityResponse } from '../models/city-response.model';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  constructor(private httpClient: HttpClient, private settings: SettingsService) { }

  getCityDetails(id: string) {
    let param = `["${id}"]`;
    let cookie = this.settings.cookie;
    let server = this.settings.server;
    let urlQueryPath = 'interface=LocationInterface&method=getTownDetails&short=96';
    return this.httpClient.get<CityResponse>(`/proxy?cookie=${encodeURIComponent(cookie)}&param=${encodeURIComponent(param)}&server=${encodeURIComponent(server)}&urlQueryPath=${encodeURIComponent(urlQueryPath)}`);
  }

  getCityPrestigeForResource(id: string, resourceId: number, rank: number) {
    let param = `["${id}",${resourceId},0,${rank},1,0]`;
    let cookie = this.settings.cookie;
    let server = this.settings.server;
    let urlQueryPath = 'interface=StatisticsInterface&method=getTransportListRank&short=96';
    return this.httpClient.get<any>(`/proxy?cookie=${encodeURIComponent(cookie)}&param=${encodeURIComponent(param)}&server=${encodeURIComponent(server)}&urlQueryPath=${encodeURIComponent(urlQueryPath)}`);
  }
}
