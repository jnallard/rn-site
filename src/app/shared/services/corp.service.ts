import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { SearchResponse } from '../models/search-response.model';
import { Corp } from '../types/corp.type';
import { BaseProxyService } from './base-proxy.service';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class CorpService extends BaseProxyService {
  private corps: { [corpId: string]: Corp } = {};

  constructor(httpClient: HttpClient, settings: SettingsService) {
    super(httpClient, settings);
  }

  getCorpId() {
    const userId = this.settings.userId;
    const param = `[["${userId}]"]`;
    const urlQueryPath = 'interface=ProfileInterface&method=getVCard&short=60411';
    return this.get<any>(urlQueryPath, param).pipe(map(response => response[userId].corporationID as string));
  }

  getCorpDetails(corpId: string) {
    if(this.corps[corpId]) {
      return of(this.corps[corpId]);
    }

    const param = `["${corpId}"]`;
    const urlQueryPath = 'interface=CorporationInterface&method=getOverviewScreen&short=96';
    return this.get<any>(urlQueryPath, param).pipe(map(response => {
      const corpResponse = response.Details;
      const corp = {
        id: corpId,
        name: corpResponse.name as string,
        memberIds: corpResponse.member.map(m => m.user_id as string) as string[]
      } as Corp;
      this.corps[corpId] = corp;
      return corp;
    }));
  }

  getCorpsInEndGame(cityId: string) {
    const param = `["${cityId}",49,30,0]`;
    const urlQueryPath = 'interface=EndgameInterface&method=getTransportListCorporation&short=96';
    return this.get<any>(urlQueryPath, param).pipe(
      map(response => Object.keys(response.Corporation))
    );
  }

  getEndGameResultForGood(corpId: string, cityId: string, resourceId: number) {
    const param = `["${cityId}","${corpId}",${resourceId},25,0]`;
    const urlQueryPath = 'interface=EndgameInterface&method=getTransportListCorporationPlayer&short=96';
    return this.get<any>(urlQueryPath, param).pipe(
      map(response => response?.Corporation as {[userId: string]: { Delivered: number, Prestige: number}} ?? {})
    );
  }

  searchCorps(searchString: string) {
    const param = `["${searchString}"]`;
    const urlQueryPath = 'interface=CorporationInterface&method=getByName&short=96';
    return this.get<{ID: string, name: String}[]>(urlQueryPath, param).pipe(map(players => players.map(player => ({id: player.ID, name: player.name} as SearchResponse))));
  }
}
