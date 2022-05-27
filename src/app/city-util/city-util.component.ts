import { Component, OnInit, ViewChild } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ConfirmationModalComponent } from '../shared/components/confirmation-modal/confirmation-modal.component';
import { IdsSelectorComponent } from '../shared/components/ids-selector/ids-selector.component';
import { StaticCityData } from '../shared/data/static-city.data';
import { CityTransportResponse } from '../shared/models/city-transport-response.model';
import { CityService } from '../shared/services/city.service';
import { ModalService } from '../shared/services/modal.service';
import { SettingsService } from '../shared/services/settings.service';
import { City } from './city.model';

enum SortMode {
  Alpha = 'alpha', Growth = 'growth', Level = 'level', Prestige = 'prestige', Pax = 'pax', PPPerTon = 'ppPerTon'
}

@Component({
  selector: 'app-city-util',
  templateUrl: './city-util.component.html',
  styleUrls: ['./city-util.component.css']
})
export class CityUtilComponent implements OnInit {

  public static BestPPRatio = -1;
  public static CurrentId = '';

  constructor(private cityService: CityService, private modalService: ModalService, public settings: SettingsService) { }

  SortMode = SortMode;
  _sortMode = localStorage.getItem('cities.sortMode') as SortMode ?? SortMode.Alpha;
  get sortMode() {
    return this._sortMode;
  }
  set sortMode(mode: SortMode) {
    this._sortMode = mode;
    localStorage.setItem('cities.sortMode', mode);
    this.sortCities();
  }

  static _loadSize = +localStorage.getItem('cities.loadSize');
  get loadSize() {
    if(CityUtilComponent._loadSize < 1) {
      CityUtilComponent._loadSize = 1;
    }
    return CityUtilComponent._loadSize;
  }
  set loadSize(size: number) {
    CityUtilComponent._loadSize = size;
    localStorage.setItem('cities.loadSize', size.toString());
  }
  
  _isLoading = false;
  get isLoading() {
    return this._isLoading || !this.idSelector || this.idSelector.isLoading;
  }
  
  @ViewChild(IdsSelectorComponent)
  private idSelector: IdsSelectorComponent

  visibleCities: City[] = [];

  cities: City[] = StaticCityData.AllCities.map(city => new City(city.name, city.id));

  ngOnInit(): void {
    CityUtilComponent.BestPPRatio = -1;
    this.cities.sort((cityA, cityB) => cityA.name.localeCompare(cityB.name));
  }

  private async loadCity(city: City, errors: string[]) {
    try {
      city.loading = true;
      let cityResponse = await this.cityService.getCityDetails(city.id).toPromise();
      city.setCityResponse(cityResponse);
      let tasks = [] as Promise<CityTransportResponse>[];
      for (let rg of city.allRgs) {
        tasks.push(
          this.cityService.getCityPrestigeForResource(city.id, rg.id, rg.myRank)
            .pipe(tap(prestigeResponse => rg.setPrestige(prestigeResponse, CityUtilComponent.CurrentId))).
            toPromise()
        );
      }
      if(tasks.length > 0) {
        await Promise.all(tasks);
      }
      city.loading = false;
    } catch (error) {
      console.error(error);
      errors.push(error.error.errorMessage);
      city.loading = false;
    }
  }

  async loadSingleCity(city: City) {
    let errors: string[] = [];
    await this.loadCity(city, errors);
    await new Promise(resolve => setTimeout(resolve, 100));
    this.sortCities();
    console.log(errors);
    if (errors.length) {
      this.modalService.open(ConfirmationModalComponent, `Errors occured while loading city data: ${errors.join(", ")}`)
    }
  }

  async loadStartingCities() {
    let myCityIds = await this.cityService.getCityIDs(CityUtilComponent.CurrentId).toPromise();
    this.cities.forEach(city => city.selected = false);
    this.cities.filter(city => myCityIds.includes(city.id)).forEach(city => city.selected = true);
  }

  async loadData() {
    let errors: string[] = [];
    const players = this.idSelector.getSelectedPlayers();
    if(players.length !== 1) {
      this.modalService.open(ConfirmationModalComponent, `You must select only one player.`);
      return;
    }
    CityUtilComponent.CurrentId = players[0].id;
    await this.loadStartingCities();

    this.visibleCities = this.cities.filter(city => city.selected);

    for (let city of this.visibleCities) {
      await this.loadCity(city, errors);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    this.sortCities();
    if (errors.length) {
      this.modalService.open(ConfirmationModalComponent, `Errors occured while loading city data: ${errors.join(", ")}`)
    }
  }

  sortCities() {
    CityUtilComponent.BestPPRatio = this.visibleCities.reduce((bestRatio, city) => Math.max(bestRatio, city.getBestPpRatio(CityUtilComponent.CurrentId)), 0.0);
    switch (this.sortMode) {
      case SortMode.Alpha:
        this.visibleCities.sort((a, b) => a.name.localeCompare(b.name));
        return;
      case SortMode.Growth:
        this.visibleCities.sort((a, b) => b.getPercentDone() - a.getPercentDone());
        return;
      case SortMode.Level:
        this.visibleCities.sort((a, b) => b.level - a.level);
        return;
      case SortMode.Prestige:
        this.visibleCities.sort((a, b) => b.getPrestigePoints() - a.getPrestigePoints());
        return;
      case SortMode.Pax:
        this.visibleCities.sort((a, b) => a.getPaxPercent() - b.getPaxPercent());
        return;
      case SortMode.PPPerTon:
        this.visibleCities.sort((a, b) => b.getBestPpRatio(CityUtilComponent.CurrentId) - a.getBestPpRatio(CityUtilComponent.CurrentId));
        return;
    }
  }

  isAnyCityLoading() {
    return this.visibleCities.some(city => city.loading);
  }

  getTotalPrestigePoints() {
    return this.visibleCities.filter(city => !city.loading).reduce((sum, nextCity) => sum += nextCity.getPrestigePoints(), 0);
  }
}
