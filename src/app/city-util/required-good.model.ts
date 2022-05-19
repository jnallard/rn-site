import * as e from "express";
import { StaticResourceData } from "../shared/data/static-resource.data";
import { CityTransportResponse } from "../shared/models/city-transport-response.model";
import { Resource } from "../shared/models/resource.model";
import { CityUtilComponent } from "./city-util.component";

export class RequiredGood {
  name: string;
  id: number;
  amountDelivered: number;
  percentDelivered: number;
  maxAmount: number;
  goalAmount: number;
  consumptionPercent: number;
  playerRank: number;
  isPaxAndComplete: boolean;
  prestige: number = null;

  get isDeliveredByPlayer() {
    return this.prestige > 0 && !this.isPaxAndComplete
  }

  private cityTransportResponse: CityTransportResponse;

  constructor(resource: Resource) {
    this.name = StaticResourceData.getResource(resource.ResourceId);
    this.id = resource.ResourceId;
    this.amountDelivered = resource.Amount;
    this.consumptionPercent = resource.ConsumptionAmount;
    this.maxAmount = resource.Limit;
    this.goalAmount = (resource.Limit * 0.67) / (1 - resource.ConsumptionAmount);
    this.percentDelivered = Math.min(Math.floor((resource.Amount / this.goalAmount) * 1000) / 10, 100);
    this.isPaxAndComplete = resource.ResourceId === 49 && resource.LastAmount === resource.Limit;
  }
  setPrestige(response: CityTransportResponse, userId: string) {
    this.cityTransportResponse = response;
    const results = response?.Result ?? [];
    const foundResult = results.find(x => x.UserId === userId);
    if (foundResult) {
      this.prestige = foundResult.Prestige;
      this.playerRank = foundResult.Position;
    }
  }

  getBestTonnagePrestigeRatio(userId: string) {
    const results = this.cityTransportResponse?.Result ?? [];
    const foundResult = results.find(x => x.UserId === userId);
    let startingAmount = 0;
    let startingPrestige = 0;
    let lastPrestige = 1;
    let bestRatio = 0;
    if (foundResult) {
      startingAmount = foundResult.Amount;
      startingPrestige = foundResult.Prestige;
    }

    if (this.isPaxAndComplete) {
      return 0;
    }
    for (let result of results) {
      const amountDifference = Math.ceil((result.Amount - startingAmount) / CityUtilComponent._loadSize);
      const prestigeDifference = result.Prestige - startingPrestige;
      lastPrestige = result.Prestige;
      if (amountDifference !== 0) {
        const tonnageRatio = prestigeDifference / amountDifference;
        bestRatio = Math.max(bestRatio, tonnageRatio);
      }
    }
    if (!foundResult) {
      const tonnageRatio = Math.max(lastPrestige * 0.6, 1) / 1;
      bestRatio = Math.max(bestRatio, tonnageRatio);
    }

    return Math.round(bestRatio * 100) / 100;
  };
}
