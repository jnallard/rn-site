import * as e from "express";
import { StaticResourceData } from "../shared/data/static-resource.data";
import { CityTransportResponse } from "../shared/models/city-transport-response.model";
import { Resource } from "../shared/models/resource.model";

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
    isDeliveredByPlayer: boolean;
    prestige: number = null;
    bestTonnagePrestigeRatio: number = null;

    constructor(resource: Resource) {
        this.name = StaticResourceData.getResource(resource.ResourceId);
        this.id = resource.ResourceId;
        this.amountDelivered = resource.Amount;
        this.playerRank = resource.PositionOfPlayer;
        this.consumptionPercent = resource.ConsumptionAmount;
        this.maxAmount = resource.Limit;
        this.goalAmount = (resource.Limit * 0.67) * (1 + resource.ConsumptionAmount);
        this.percentDelivered = Math.min(Math.floor((resource.Amount / this.goalAmount) * 1000) / 10, 100);
        this.isPaxAndComplete = resource.ResourceId === 49 && resource.LastAmount === resource.Limit;
        this.isDeliveredByPlayer = resource.DeliveredByPlayer && !this.isPaxAndComplete;
    }

    setPrestige(response: CityTransportResponse, userId: string) {
        const results = response?.Result ?? [];
        const foundResult = results.find(x => x.UserId === userId);
        let startingAmount = 0;
        let startingPrestige = 0;
        let lastPrestige = 1;
        let bestRatio = 0;
        if (foundResult) {
            startingAmount = foundResult.Amount;
            this.prestige = foundResult.Prestige;
            startingPrestige = foundResult.Prestige;
        }

        if (this.isPaxAndComplete) {
            this.bestTonnagePrestigeRatio = 0;
            return;
        }
        for (let result of results) {
            const amountDifference = result.Amount - startingAmount;
            const prestigeDifference = result.Prestige - startingPrestige;
            lastPrestige = result.Prestige;
            if (amountDifference !== 0) {
                const tonnageRatio = prestigeDifference / amountDifference;
                bestRatio = Math.max(bestRatio, tonnageRatio);
            }
        }
        if(!foundResult) {
            const tonnageRatio = Math.max(lastPrestige * 0.6, 1) / 1;
            bestRatio = Math.max(bestRatio, tonnageRatio);
        }

        this.bestTonnagePrestigeRatio = Math.round(bestRatio * 100) / 100;
    }
}