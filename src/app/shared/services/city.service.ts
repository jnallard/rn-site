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

  getCityDetails(param: string) {
    param = `["${param}"]`;
    let cookie = this.settings.cookie;
    let server = this.settings.server;
    let urlQueryPath = 'interface=LocationInterface&method=getTownDetails&short=96';
    return this.httpClient.get<CityResponse>(`/proxy?cookie=${encodeURIComponent(cookie)}&param=${encodeURIComponent(param)}&server=${encodeURIComponent(server)}&urlQueryPath=${encodeURIComponent(urlQueryPath)}`);
  }
}
