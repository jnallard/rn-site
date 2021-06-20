import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PrestigeFilterType } from '../enums/prestige-filter-type.enum';
import { PrestigeResponse } from '../models/prestige-response.model';
import { ProfileResponse } from '../models/profile-response.model';
import { RankResponse } from '../models/rank-response.model';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor(private httpClient: HttpClient, private settings: SettingsService) { }

  getTopPlayers(rankStartIndex: number, rankEndIndex: number) {
    let param = `[${rankStartIndex},${rankEndIndex}]`;
    let cookie = this.settings.cookie;
    let server = this.settings.server;
    let urlQueryPath = 'interface=PlayerHighscoreInterface&method=get&short=96';
    return this.httpClient.get<RankResponse>(`/proxy?cookie=${encodeURIComponent(cookie)}&param=${encodeURIComponent(param)}&server=${encodeURIComponent(server)}&urlQueryPath=${encodeURIComponent(urlQueryPath)}`);
  }

  getPlayerProfiles(ids: string[]) {
    let param = `[${JSON.stringify(ids)}]`;
    let cookie = this.settings.cookie;
    let server = this.settings.server;
    let urlQueryPath = 'interface=ProfileInterface&method=getVCard&short=96';
    return this.httpClient.get<ProfileResponse>(`/proxy?cookie=${encodeURIComponent(cookie)}&param=${encodeURIComponent(param)}&server=${encodeURIComponent(server)}&urlQueryPath=${encodeURIComponent(urlQueryPath)}`);
  }

  getPrestigeHistory(id: string, type: PrestigeFilterType) {
    let param = `["${id}",${type}]`;
    let cookie = this.settings.cookie;
    let server = this.settings.server;
    let urlQueryPath = 'interface=BudgetInterface&method=getPrestigeHistoryDetails&short=96';
    return this.httpClient.get<PrestigeResponse>(`/proxy?cookie=${encodeURIComponent(cookie)}&param=${encodeURIComponent(param)}&server=${encodeURIComponent(server)}&urlQueryPath=${encodeURIComponent(urlQueryPath)}`);
  }
}
