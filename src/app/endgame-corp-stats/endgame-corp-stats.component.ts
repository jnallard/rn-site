import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { StaticResourceData } from '../shared/data/static-resource.data';
import { AccountService } from '../shared/services/account.service';
import { CorpService } from '../shared/services/corp.service';

@Component({
  selector: 'app-endgame-corp-stats',
  templateUrl: './endgame-corp-stats.component.html',
  styleUrls: ['./endgame-corp-stats.component.css'],
})
export class EndgameCorpStatsComponent implements OnInit {
  corpId = '';
  homeTownId = '';
  isLoading = true;

  private gridAPI: GridApi;
  columnDefs: ColDef[] = [
    { field: 'user', pinned: true },
    { field: 'total' },
    { field: 'totalNoPax' },
  ].concat(StaticResourceData.getResources().map((r) => ({ field: r.name })));
  defaultColDef = {
    minWidth: 120,
    sortable: true,
    resizable: true,
  } as ColDef;

  onGridReady(event: GridReadyEvent) {
    this.gridAPI = event.api;
    event.api.sizeColumnsToFit();
  }

  userData = new Map<string, any>();
  rowData: any[] = [];
  //rowData = of(this._rowData);

  constructor(
    private accountService: AccountService,
    private corpService: CorpService
  ) {}

  ngOnInit(): void {
    this.loadData().then();
  }

  async loadData() {
    const account = await this.getAccount();
    this.corpId = account.corpId;
    this.homeTownId = account.homeTownId;
    console.log(this.corpId, this.homeTownId);
    const userIds = await this.getUserIds(this.corpId);
    console.log(userIds);
    const users = await this.getUserNames(userIds);
    for (const user of users) {
      this.userData.set(user.id, { user: user.name, total: 0, totalNoPax: 0 });
    }
    this.updateRows();
    console.log(users);
    await this.getResourceGoods(this.corpId, this.homeTownId);
    this.isLoading = false;
  }

  async getAccount() {
    return await this.accountService.getMyProfile().toPromise();
  }

  async getUserIds(corpId: string) {
    return await this.corpService.getUserIds(corpId).toPromise();
  }

  async getUserNames(userIds: string[]) {
    return await this.corpService.getUsers(userIds).toPromise();
  }

  async getResourceGoods(cordId: string, cityId: string) {
    for (const resource of StaticResourceData.getResources()) {
      const result = await this.corpService
        .getEndGameResultForGood(cordId, cityId, resource.id)
        .toPromise();
      console.log(result);
      const users = Object.keys(result);
      for (const user of users) {
        const userRecord = result[user];
        const currentData = this.userData.get(user);
        currentData[resource.name] = userRecord.Delivered;
        currentData.total += userRecord.Delivered;
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
}
