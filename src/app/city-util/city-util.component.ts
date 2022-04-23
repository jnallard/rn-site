import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ConfirmationModalComponent } from '../shared/components/confirmation-modal/confirmation-modal.component';
import { StaticCityData } from '../shared/data/static-city.data';
import { CityTransportResponse } from '../shared/models/city-transport-response.model';
import { CityService } from '../shared/services/city.service';
import { ModalService } from '../shared/services/modal.service';
import { City } from './city.model';

enum SortMode {
  Alpha = 'alpha', Growth = 'growth', Level = 'level', Prestige = 'prestige', Pax = 'pax'
}

@Component({
  selector: 'app-city-util',
  templateUrl: './city-util.component.html',
  styleUrls: ['./city-util.component.css']
})
export class CityUtilComponent implements OnInit {

  constructor(private cityService: CityService, private modalService: ModalService) { }

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

  visibleCities: City[] = [];

  cities: City[] = StaticCityData.AllCities.map(city => new City(city.name, city.id));

  ngOnInit(): void {
    this.cities.sort((cityA, cityB) => cityA.name.localeCompare(cityB.name));
    this.loadStartingCities().then(() => this.loadData()).then();
  }

  async selectMany(isSelected: boolean) {
    this.cities.forEach(city => city.selected = isSelected)
    await this.loadData();
  }

  async toggleCity(city: City) {
    city.selected = !city.selected;
    this.visibleCities = this.cities.filter(city => city.selected);
    if (city.selected) {
      await this.loadSingleCity(city);
    }
  }

  private async loadCity(city: City, errors: string[]) {
    try {
      city.loading = true;
      let cityResponse = await this.cityService.getCityDetails(city.id).toPromise();
      city.setCityResponse(cityResponse);
      let tasks = [] as Promise<CityTransportResponse>[];
      for (let rg of city.allRgs.filter(rg => rg.isDeliveredByPlayer)) {
        tasks.push(
          this.cityService.getCityPrestigeForResource(city.id, rg.id, rg.playerRank)
            .pipe(tap(prestigeResponse => rg.setPrestige(prestigeResponse))).
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
    let myCityIds = await this.cityService.getMyCityIDs().toPromise();
    this.cities.filter(city => myCityIds.includes(city.id)).forEach(city => city.selected = true);
  }

  async loadData() {
    let errors: string[] = [];

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
    }
  }

  isAnyCityLoading() {
    return this.visibleCities.some(city => city.loading);
  }

  getTotalPrestigePoints() {
    return this.visibleCities.filter(city => !city.loading).reduce((sum, nextCity) => sum += nextCity.getPrestigePoints(), 0);
  }
}
