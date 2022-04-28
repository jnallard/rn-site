import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { BaseProxyService } from './base-proxy.service';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class CorpService extends BaseProxyService {

  constructor(httpClient: HttpClient, settings: SettingsService) {
    super(httpClient, settings);
  }

  getCorpId() {
    const userId = this.settings.userId;
    const param = `[["${userId}]"]`;
    const urlQueryPath = 'interface=ProfileInterface&method=getVCard&short=60411';
    return this.get<any>(urlQueryPath, param).pipe(map(response => response[userId].corporationID as string));
  }

  getUserIds(corpId: string) {
    const param = `["${corpId}"]`;
    const urlQueryPath = 'interface=CorporationInterface&method=getOverviewScreen&short=96';
    return this.get<any>(urlQueryPath, param).pipe(map(response => response.Details.member.map(m => m.user_id as string)));
  }

  getUsers(userIds: string[]) {
    const param = `[${JSON.stringify(userIds)}]`;
    const urlQueryPath = 'interface=ProfileInterface&method=getVCard&short=60411';
    return this.get<any>(urlQueryPath, param).pipe(map(response => Object.values(response).map((u: any) => {
      return {
        id: u.userID as string,
        name: u.userName as string,
      };
    })));
  }

  getEndGameResultForGood(corpId: string, cityId: string, resourceId: number) {
    const param = `["${cityId}","${corpId}",${resourceId},25,0]`;
    const urlQueryPath = 'interface=EndgameInterface&method=getTransportListCorporationPlayer&short=96';
    return this.get<any>(urlQueryPath, param).pipe(map(response => response.Corporation as {[userId: string]: { Delivered: number}}));
  }
}
