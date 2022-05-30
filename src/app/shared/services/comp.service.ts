import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { StaticCityData } from '../data/static-city.data';
import { Comp } from '../models/comp.model';
import { BaseProxyService } from './base-proxy.service';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class CompService extends BaseProxyService {
  private cityDict = StaticCityData.getCityDictionary();

  constructor(httpClient: HttpClient, settings: SettingsService) {
    super(httpClient, settings);
  }

  getAllComps() {
    const param = `[]`;
    const urlQueryPath = 'interface=TenderingInterface&method=getForUser&short=96';
    return this.get<any>(urlQueryPath, param).pipe(map(response => {
      const now = new Date();
      const comps = (response.Tenderings as any[]).map(comp => new Comp(comp, this.settings.userId, this.cityDict));
      comps.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
      return comps.filter(comp => comp.startTime.getTime() + (comp.duration * 1000) >= now.getTime());
    }));
  }

  getComp(compId: string) {
    const param = `["${compId}"]`;
    const urlQueryPath = 'interface=TenderingInterface&method=getTenderingDetails&short=96';
    return this.get<any>(urlQueryPath, param).pipe(map(response => new Comp(response, this.settings.userId, this.cityDict)));
  }
}
