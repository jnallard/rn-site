import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PrestigeFilterType } from '../enums/prestige-filter-type.enum';
import { PrestigeResponse } from '../models/prestige-response.model';
import { RankResponse } from '../models/rank-response.model';
import { BaseProxyService } from './base-proxy.service';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService extends BaseProxyService {

  constructor(httpClient: HttpClient, settings: SettingsService) {
    super(httpClient, settings);
  }

  getTopPlayers(rankStartIndex: number, rankEndIndex: number) {
    let param = `[${rankStartIndex},${rankEndIndex}]`;
    let urlQueryPath = 'interface=PlayerHighscoreInterface&method=get&short=96';
    return this.get<RankResponse>(urlQueryPath, param);
  }

  getPlayerProfiles(ids: string[]) {
    let param = `[${JSON.stringify(ids)}]`;
    let urlQueryPath = 'interface=ProfileInterface&method=getVCard&short=96';
    return this.get(urlQueryPath, param);
  }

  getPrestigeHistory(id: string, type: PrestigeFilterType) {
    let param = `["${id}",${type}]`;
    let urlQueryPath = 'interface=BudgetInterface&method=getPrestigeHistoryDetails&short=96';
    return this.get<PrestigeResponse>(urlQueryPath, param);
  }
}
