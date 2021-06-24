import { CityTransportResponse } from "../shared/models/city-transport-response.model";
import { Resource } from "../shared/models/resource.model";
import { Resources } from "./resource.util";

export class RequiredGood {
    name: string;
    id: number;
    amountDelivered: number;
    percentDelivered: number;
    maxAmount: number;
    goalAmount: number;
    consumptionPercent: number;
    playerRank: number;
    isDeliveredByPlayer: boolean;
    prestige: number = null;

    constructor(resource: Resource) {
        this.name = Resources.getResource(resource.ResourceId);
        this.id = resource.ResourceId;
        this.amountDelivered = resource.Amount;
        this.playerRank = resource.PositionOfPlayer;
        this.consumptionPercent = resource.ConsumptionAmount; 
        this.maxAmount = resource.Limit;
        this.goalAmount = (resource.Limit * 0.67) * (1 + resource.ConsumptionAmount);
        this.percentDelivered = Math.min(Math.floor((resource.Amount / this.goalAmount) * 1000)/10, 100);
        this.isDeliveredByPlayer = resource.DeliveredByPlayer;
        console.log(this);
    }

    setPrestige(response: CityTransportResponse) {
        if(response?.Body?.Result && response?.Body?.Result.length == 1){
            this.prestige = response.Body.Result[0].Prestige;
        }
    }
}