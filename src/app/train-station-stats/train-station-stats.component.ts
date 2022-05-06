import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Hotel, Restaurant, ShoppingCenter, StaticBuildingData } from '../shared/data/static-building.data';
import { AccountService } from '../shared/services/account.service';
import { BuildingService } from '../shared/services/building.service';
import { CorpService } from '../shared/services/corp.service';

@Component({
  selector: 'app-train-station-stats',
  templateUrl: './train-station-stats.component.html',
  styleUrls: ['./train-station-stats.component.css'],
})
export class TrainStationStatsComponent implements OnInit {
  myCorpId = '';

  isLoading = true;
  corpSelection = 'mine';

  userData = new Map<string, any>();
  rowData: any[] = [];

  private gridAPI: GridApi;
  columnDefs: ColDef[] = [
    { field: 'user', pinned: true } as ColDef,
    { field: 'corporation', pinned: true },
    { field: 'totalLevels' },
    { field: 'prestigeLeft' },
    { field: 'dailyMoney' },
    { field: 'dailyPrestige' },
    { field: 'workerMoneyBonus' },
    { field: 'workerPrestigeBonus' },
  ].concat(StaticBuildingData.AllBuildings.map((b) => ({
    field: b.name, comparator: (valueA, valueB) => valueA - valueB,
    cellRenderer: params => {
      if (!params.value) {
        return '';
      }
      const percent = Math.floor(100 * params.value / b.maxLevel);
      return `<p style="background: linear-gradient(90deg, #00ffff59 ${percent}%, #00000000 0%);">${params.value}</p>`;
    }
  })));

  defaultColDef = {
    minWidth: 120,
    sortable: true,
    resizable: true,
  } as ColDef;

  constructor(
    private accountService: AccountService,
    private corpService: CorpService,
    private buildingService: BuildingService,
  ) { }

  ngOnInit(): void {
    this.loadInitialData().then();
  }

  async loadInitialData() {
    const account = await this.getAccount();
    this.myCorpId = account.corpId;
    this.isLoading = false;
  }

  async loadData() {
    this.isLoading = true;
    let corpId = this.myCorpId;

    // todo: handle corp selection later
    const corp = await this.getCorpDetails(corpId);
    const userIds = corp.members;
    const users = await this.getUserNames(userIds);
    for (const user of users) {
      this.userData.set(user.id, { user: user.name, corporation: corp.name, totalLevels: 0, prestigeLeft: 0, dailyMoney: 0, dailyPrestige: 0, workerMoneyBonus: 0, workerPrestigeBonus: 0 });
    }
    this.updateRows();
    await this.getBuildings(users.map(user => user.id));
    this.isLoading = false;
  }

  async getAccount() {
    return await this.accountService.getMyProfile().toPromise();
  }

  async getCorpDetails(corpId: string) {
    return await this.corpService.getCorpDetails(corpId).toPromise();
  }

  async getUserNames(userIds: string[]) {
    return await this.corpService.getUsers(userIds).toPromise();
  }

  async getBuildings(userIds: string[]) {
    for (const userId of userIds) {
      const currentData = this.userData.get(userId);
      const buildingLevels = await this.buildingService.getStationBuildings(userId).toPromise();
      for (const buildingLevel of buildingLevels) {
        const building = StaticBuildingData.getBuildingDictionary()[buildingLevel.id];
        if (!building) {
          break;
        }
        currentData[building.name] = buildingLevel.level;
        currentData.totalLevels += buildingLevel.level;
        currentData.prestigeLeft += building.getPrestigeLeft(buildingLevel.level);
      }
      const restaurantLevel = Restaurant.levelData.find(ld => ld.level === currentData[Restaurant.name] as number);
      const shoppingCenterLevel = ShoppingCenter.levelData.find(ld => ld.level === currentData[ShoppingCenter.name] as number);
      const hotelLevel = Hotel.levelData.find(ld => ld.level === currentData[Hotel.name] as number);
      currentData.dailyMoney = Restaurant.getDailyBonus(restaurantLevel.level, hotelLevel.multiplier, 45) + ShoppingCenter.getDailyBonus(shoppingCenterLevel.level, hotelLevel.multiplier, 180);
      currentData.dailyPrestige = Hotel.getDailyBonus(hotelLevel.level, 1, 90);
      currentData.workerMoneyBonus = Restaurant.getDailyBonus(restaurantLevel.level, hotelLevel.multiplier, 27) + ShoppingCenter.getDailyBonus(shoppingCenterLevel.level, hotelLevel.multiplier, 108) - currentData.dailyMoney;
      currentData.workerPrestigeBonus = Hotel.getDailyBonus(hotelLevel.level, 1, 54) - currentData.dailyPrestige;

      this.updateRows();
    }
  }

  updateRows() {
    this.rowData = [...this.userData.values()];
    this.gridAPI.sizeColumnsToFit();
  }

  export() {
    this.gridAPI.exportDataAsCsv({ fileName: 'buildings.csv' });
  }

  onGridReady(event: GridReadyEvent) {
    this.gridAPI = event.api;
    event.api.sizeColumnsToFit();
  }
}
