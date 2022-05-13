import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
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

  getPrestigeHistory(id: string, type: PrestigeFilterType) {
    let param = `["${id}",${type}]`;
    let urlQueryPath = 'interface=BudgetInterface&method=getPrestigeHistoryDetails&short=96';
    return this.get<PrestigeResponse>(urlQueryPath, param);
  }
}
