import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { CityDictionary, StaticCityData } from '../data/static-city.data';
import { StaticResourceData } from '../data/static-resource.data';
import { Train } from '../models/train.model';
import { BaseProxyService } from './base-proxy.service';
import { SettingsService } from './settings.service';

interface ScheduleDto { Resources: {[resourceId: string]: {Load: number; Unload: number}}; TargetPosition: string; NextTarget: number; }
interface TrainDto { Id: string; Name: string; Schedule: ScheduleDto[]; }

@Injectable({
  providedIn: 'root'
})
export class TrainService extends BaseProxyService {

  constructor(httpClient: HttpClient, settings: SettingsService) {
    super(httpClient, settings);
  }

  getTrainGoodsForCities(userId: string) {
    const staticCities = StaticCityData.getCityDictionary(this.settings.serverInfo);
    const param = `["${userId}"]`;
    const urlQueryPath = 'interface=TrainInterface&method=getTrainsOfUser&short=60411';
    return this.get<TrainDto[]>(urlQueryPath, param).pipe(map(trains => {
      return trains.filter(train => train.Schedule).map(train => this.convertTrain(train, staticCities));
    }));
  }

  private convertTrain(train: TrainDto, staticCities: CityDictionary) {
    return {
      a: train,
      id: train.Id,
      name: train.Name,
      schedule: this.getActiveSchedule(train)
        .map(sched => {
          return {
            city: staticCities[sched.TargetPosition],
            unloadedResource: this.getUnloadedGood(sched)
          };
        })
    } as Train;
  }

  private getUnloadedGood(scheduleStop: ScheduleDto) {
    return StaticResourceData.getResource(Object.keys(scheduleStop.Resources)
      .find(res => scheduleStop.Resources[res].Unload > 0));
  }

  private getActiveSchedule(train: TrainDto) {
    const startingIndex = train.Schedule[train.Schedule.length - 1].NextTarget;
    return train.Schedule
      .slice(startingIndex)
      .filter(
        sched => Object.keys(sched.Resources).length > 0 && Object.values(sched.Resources).some(res => res.Unload > 0)
      );
  }
}
