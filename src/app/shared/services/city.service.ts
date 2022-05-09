import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { StaticCityData } from '../data/static-city.data';
import { CityResponse } from '../models/city-response.model';
import { CityTransportResponse } from '../models/city-transport-response.model';
import { BaseProxyService } from './base-proxy.service';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class CityService extends BaseProxyService {

  constructor(httpClient: HttpClient, settings: SettingsService) {
    super(httpClient, settings);
  }

  getCityDetails(id: string) {
    let param = `["${id}"]`;
    let urlQueryPath = 'interface=LocationInterface&method=getTownDetails&short=96';
    return this.get<CityResponse>(urlQueryPath, param);
  }

  getCityPrestigeForResource(id: string, resourceId: number, rank: number) {
    rank = Math.max(0, rank ?? 15) + 1;
    let param = `["${id}",${resourceId},0,0,${rank},0]`;
    let urlQueryPath = 'interface=StatisticsInterface&method=getTransportListRank&short=96';
    return this.get<CityTransportResponse>(urlQueryPath, param);
  }

  getMyCityIDs() {
    let param = `["${this.settings.userId}"]`;
    let urlQueryPath = 'interface=RailInterface&method=getForUser&short=60411';
    return this.get<{FromId: string, ToId: string}[]>(urlQueryPath, param).pipe(map(routes => {
      let destIds = new Set<string>();
      routes.forEach(route => {
        destIds.add(route.FromId);
        destIds.add(route.ToId);
      });
      let staticCities = StaticCityData.getCityDictionary();
      let ids = Array.from(destIds.entries()).map(e => e[1]).filter(id => staticCities[id]);
      return ids;
    }));
  }
}
