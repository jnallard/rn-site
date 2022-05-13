import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Hotel, LevelData, Restaurant, ShoppingCenter, StaticBuildingData } from '../shared/data/static-building.data';
import { AccountService } from '../shared/services/account.service';
import { BuildingService } from '../shared/services/building.service';
import { CorpService } from '../shared/services/corp.service';
import { PlayerService } from '../shared/services/player.service';

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

  restaurantPeriod: number;
  shoppingCenterPeriod: number;
  hotelPeriod: number;

  private numberComparator = (valueA, valueB) => valueA - valueB;
  private gridAPI: GridApi;
  columnDefs: ColDef[] = [
    { field: 'user', pinned: true } as ColDef,
    { field: 'corporation', pinned: true },
    { field: 'suggestedWorkerBid', cellStyle: { 'background-color': 'yellow' }, pinned: true, comparator: this.numberComparator },
  ].concat(StaticBuildingData.AllBuildings.map((b) => ({
    field: b.name, comparator: this.numberComparator,
    cellRenderer: params => {
      if (!params.value) {
        return '';
      }
      const percent = Math.floor(100 * params.value / b.maxLevel);
      return `<p style="background: linear-gradient(90deg, #00ffff59 ${percent}%, #00000000 0%);">${params.value}</p>`;
    }
  })))
  .concat([
    { field: 'totalLevels', comparator: this.numberComparator },
    { field: 'prestigeLeft', comparator: this.numberComparator },
    { field: 'dailyMoney', comparator: this.numberComparator },
    { field: 'dailyPrestige', comparator: this.numberComparator },
    { field: 'workerMoneyBonus', comparator: this.numberComparator },
    { field: 'workerPrestigeBonus', comparator: this.numberComparator },
  ]);

  defaultColDef = {
    minWidth: 120,
    sortable: true,
    resizable: true,
  } as ColDef;

  constructor(
    private accountService: AccountService,
    private playerService: PlayerService,
    private corpService: CorpService,
    private buildingService: BuildingService,
  ) { }

  ngOnInit(): void {
    this.loadInitialData().then();
  }

  async loadInitialData() {
    const account = await this.getAccount();
    this.myCorpId = account.corpId;
    const serverInfo = await this.getServerInfo();
    // TODO: Figure out if I can get the period data with a service call. Only 'default' and 'speed' seem like options right now
    switch (serverInfo.speed) {
      case 'speed': // 2x 
        this.restaurantPeriod = 45;
        this.shoppingCenterPeriod = 180;
        this.hotelPeriod = 90;
        break;
      default: //1x
        this.restaurantPeriod = 90;
        this.shoppingCenterPeriod = 360;
        this.hotelPeriod = 180;
        break;
    }
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
      this.userData.set(user.id, { user: user.name, corporation: corp.name, totalLevels: 0, prestigeLeft: 0, dailyMoney: 0, dailyPrestige: 0, workerMoneyBonus: 0, workerPrestigeBonus: 0, suggestedWorkerBid: 0 });
    }
    this.updateRows();
    await this.getBuildings(users.map(user => user.id));
    this.isLoading = false;
  }

  async getAccount() {
    return await this.accountService.getMyProfile().toPromise();
  }

  async getServerInfo() {
    return await this.accountService.getServerInfo().toPromise();
  }

  async getCorpDetails(corpId: string) {
    return await this.corpService.getCorpDetails(corpId).toPromise();
  }

  async getUserNames(userIds: string[]) {
    return await this.playerService.getUsers(userIds).toPromise();
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
      currentData.dailyMoney = this.getDailyBonusMoney(restaurantLevel, shoppingCenterLevel, hotelLevel, false);
      currentData.dailyPrestige = this.getDailyBonusPrestige(hotelLevel, false);
      currentData.workerMoneyBonus = this.getDailyBonusMoney(restaurantLevel, shoppingCenterLevel, hotelLevel, true) - currentData.dailyMoney;
      currentData.workerPrestigeBonus = this.getDailyBonusPrestige(hotelLevel, true) - currentData.dailyPrestige;
      currentData.suggestedWorkerBid = currentData.workerMoneyBonus + (currentData.workerPrestigeBonus * 10000);

      this.updateRows();
    }
  }

  private getDailyBonusMoney(restaurantLevel: LevelData, shoppingCenterLevel: LevelData, hotelLevel: LevelData, withWorker: boolean) {
    const restaurantPeriodAdjusted = withWorker ? this.restaurantPeriod * 0.60 : this.restaurantPeriod;
    const scPeriodAdjusted = withWorker ? this.shoppingCenterPeriod * 0.60 : this.shoppingCenterPeriod;
    return Restaurant.getDailyBonus(restaurantLevel.level, hotelLevel.multiplier, restaurantPeriodAdjusted) + ShoppingCenter.getDailyBonus(shoppingCenterLevel.level, hotelLevel.multiplier, scPeriodAdjusted);
  }

  private getDailyBonusPrestige(hotelLevel: LevelData, withWorker: boolean) {
    const hotelPeriodAdjusted = withWorker ? this.hotelPeriod * 0.60 : this.hotelPeriod;
    return Hotel.getDailyBonus(hotelLevel.level, 1, hotelPeriodAdjusted);
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
