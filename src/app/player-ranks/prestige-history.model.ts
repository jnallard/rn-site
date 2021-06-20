import { PrestigeType } from "../shared/enums/prestige-type.enum";
import { PrestigeResponse } from "../shared/models/prestige-response.model";

export class PrestigeHistory {

    get transportPrestige() {
        return this.getPrestige(PrestigeType.Transports);
    }

    get transportPrestigeRank() {
        return this.getPrestigeRank(PrestigeType.Transports);
    }

    get compPrestige() {
        return this.getPrestige(PrestigeType.Competitions);
    }

    get compPrestigeRank() {
        return this.getPrestigeRank(PrestigeType.Competitions);
    }

    get investmentPrestige() {
        return this.getPrestige(PrestigeType.Investments);
    }

    get investmentPrestigeRank() {
        return this.getPrestigeRank(PrestigeType.Investments);
    }

    get trainStationPrestige() {
        return this.getPrestige(PrestigeType.TrainStation);
    }

    get trainStationPrestigeRank() {
        return this.getPrestigeRank(PrestigeType.TrainStation);
    }

    get medalPrestige() {
        return this.getPrestige(PrestigeType.Medal);
    }

    get medalPrestigeRank() {
        return this.getPrestigeRank(PrestigeType.Medal);
    }

    get miscPrestige() {
        return this.getPrestige(PrestigeType.Misc);
    }

    get miscPrestigeRank() {
        return this.getPrestigeRank(PrestigeType.Misc);
    }

    get totalPrestige() {
        return Array.from(this.prestigeHistoryResponse.Body.balance.values()).reduce((prev, curr) => prev + +curr.prestige, 0);
    }

    get totalPrestigeRank() {
        return this.prestigeHistoryResponse.Body.playerRank + 1;
    }

    constructor(private prestigeHistoryResponse: PrestigeResponse) {
    }

    private getPrestige(type: PrestigeType) {
        return this.prestigeHistoryResponse.Body.balance.find(x => x.type == type)?.prestige;
    }

    private getPrestigeRank(type: PrestigeType) {
        const rank = this.prestigeHistoryResponse.Body.ranking[type];
        return rank != null ? rank + 1 : null;
    }
}