import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { StaticCityData } from '../shared/data/static-city.data';
import { StaticResourceData } from '../shared/data/static-resource.data';
import { AccountService } from '../shared/services/account.service';
import { CorpService } from '../shared/services/corp.service';
import { PlayerService } from '../shared/services/player.service';

@Component({
  selector: 'app-endgame-corp-stats',
  templateUrl: './endgame-corp-stats.component.html',
  styleUrls: ['./endgame-corp-stats.component.css'],
})
export class EndgameCorpStatsComponent implements OnInit {
  myHomeTownId = '';
  myCorpId = '';

  isLoading = true;
  cities = StaticCityData.AllCities.slice(0);
  cityId: string;
  corpSelection = 'mine';

  userData = new Map<string, any>();
  rowData: any[] = [];

  private gridAPI: GridApi;
  columnDefs: ColDef[] = [
    { field: 'user', pinned: true },
    { field: 'corporation', pinned: true },
    { field: 'total' },
    { field: 'totalNoPax', headerName: 'Total (without PAX)' },
    { field: 'totalPrestige', headerName: 'Prestige Gained' },
  ].concat(StaticResourceData.getResources().map((r) => ({ field: r.name, comparator: (valueA, valueB) => valueA - valueB })));
  defaultColDef = {
    minWidth: 120,
    sortable: true,
    resizable: true,
  } as ColDef;

  constructor(
    private accountService: AccountService,
    private playerService: PlayerService,
    private corpService: CorpService
  ) {}

  ngOnInit(): void {
    this.cities.sort((a, b) => a.name.localeCompare(b.name));
    this.loadInitialData().then();
  }

  async loadInitialData() {
    const account = await this.getAccount();
    this.myCorpId = account.corpId;
    this.myHomeTownId = account.homeTownId;
    this.cityId = this.myHomeTownId;
    this.isLoading = false;
  }

  async loadData() {
    this.isLoading = true;
    let corpIds = [this.myCorpId];
    if (this.corpSelection === 'all') {
      corpIds = await this.getCorpsInCity(this.cityId);
    }
    for (const corpId of corpIds) {
      const corp = await this.getCorpDetails(corpId);
      const userIds = corp.members;
      const users = await this.getUserNames(userIds);
      for (const user of users) {
        this.userData.set(user.id, { user: user.name, corporation: corp.name, total: 0, totalNoPax: 0, totalPrestige: 0 });
      }
      this.updateRows();
      await this.getResourceGoods(corpId, this.cityId);
    }
    this.isLoading = false;
  }

  async getAccount() {
    return await this.accountService.getMyProfile().toPromise();
  }

  async getCorpsInCity(cityId: string) {
    return await this.corpService.getCorpsInEndGame(cityId).toPromise();
  }

  async getCorpDetails(corpId: string) {
    return await this.corpService.getCorpDetails(corpId).toPromise();
  }

  async getUserNames(userIds: string[]) {
    return await this.playerService.getUsers(userIds).toPromise();
  }

  async getResourceGoods(cordId: string, cityId: string) {
    for (const resource of StaticResourceData.getResources()) {
      const result = await this.corpService
        .getEndGameResultForGood(cordId, cityId, resource.id)
        .toPromise();
      const users = Object.keys(result);
      for (const user of users) {
        const userRecord = result[user];
        const currentData = this.userData.get(user);
        currentData[resource.name] = userRecord.Delivered;
        currentData.total += userRecord.Delivered;
        currentData.totalPrestige += userRecord.Prestige;
        if (resource.id !== 49) {
          currentData.totalNoPax += userRecord.Delivered;
        }
      }
      this.updateRows();
    }
  }

  updateRows() {
    this.rowData = [...this.userData.values()];
    this.gridAPI.sizeColumnsToFit();
  }

  export() {
    this.gridAPI.exportDataAsCsv({ fileName: 'endgame.csv' });
  }

  onGridReady(event: GridReadyEvent) {
    this.gridAPI = event.api;
    event.api.sizeColumnsToFit();
  }
}
