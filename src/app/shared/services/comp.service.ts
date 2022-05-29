import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { StaticCityData } from '../data/static-city.data';
import { StaticResourceData } from '../data/static-resource.data';
import { BaseProxyService } from './base-proxy.service';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class CompService extends BaseProxyService {
  private cityDict = StaticCityData.getCityDictionary();

  private readonly rewardTypes = {
    0: 'Money',
    1: 'Gold/Plus',
    2: 'Prestige',
    3: 'Research',
    9: 'Lottery',
    11: 'License',
    70: 'Cargo Train',
  };

  constructor(httpClient: HttpClient, settings: SettingsService) {
    super(httpClient, settings);
  }

  getAllComps() {
    const param = `[]`;
    const urlQueryPath = 'interface=TenderingInterface&method=getForUser&short=96';
    return this.get<any>(urlQueryPath, param).pipe(map(response => {
      const now = new Date();
      const comps = (response.Tenderings as any[]).map(comp => {
        const startTime = new Date();
        startTime.setSeconds(now.getSeconds() + comp.StartTime as number);
        const rewardType = this.rewardTypes[Object.keys(comp.Rewards).find(type => type !== '0')] ?? 'Unknown';
        const participant = comp.Participants[this.settings.userId];
        return {
          city: this.cityDict[comp.LocationId]?.name,
          resource: StaticResourceData.getResource(comp.Resource),
          startTime,
          startsIn: startTime,
          duration: comp.Duration as number,
          requiredAmount: comp.RequiredAmount as number,
          rewardType,
          rewardMoney: comp.Rewards[0] as number,
          rewardPrestige: comp.Rewards[2] as number,
          originalResponse: comp,
          playerAccepted: participant.Accepted,
          playerCompleted: participant.Completed,
        };
      });
      comps.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
      return comps.filter(comp => comp.startTime.getTime() + (comp.duration * 1000)  >= now.getTime());
    }));
  }
}
