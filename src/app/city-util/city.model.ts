import { CityResponse } from "../shared/models/city-response.model";
import { RequiredGood } from "./required-good.model";
import { Md5 } from 'ts-md5/dist/md5';

export class City {
    rgs: RequiredGood[] | null = null;
    paxRg: RequiredGood;
    level: number;
    hash: string;
    loading = false;

    selected = false;

    get allRgs() {
        if(!this.rgs) {
            return null;
        }
        return this.paxRg ? this.rgs.concat([this.paxRg]) : this.rgs;
    }

    constructor(public name: string, public id: string) {
        this.hash = Md5.hashAsciiStr(`["${id}"]`);
    }

    setCityResponse(cityResponse: CityResponse) {
        const priorities = cityResponse.Priorities;
        this.rgs = cityResponse.StoragesInfo.Incoming.filter(x => x != 49 && priorities[x] === 1).slice(-4).map(rg => {
            const storage = cityResponse.StoragesInfo.Storages.find(st => st.ResourceId === rg);
            return new RequiredGood(storage!);
        });
        let paxStorage = cityResponse.StoragesInfo.Storages.find(st => st.ResourceId === 49);
        if(paxStorage) {
            this.paxRg = new RequiredGood(paxStorage);
        }
        this.level = cityResponse.Level;
    }

    getPercentDone() {
        if(!this.rgs) {
            return -1;
        }
        let rgs = this.rgs.slice(0);
        if(this.paxRg) {
            rgs.push(this.paxRg);
        }
        return Math.round(rgs.reduce((sum, nextRg) => sum += nextRg.percentDelivered, 0) / rgs.length);
    }

    getPrestigePoints() {
      return this.allRgs?.filter(rg => rg?.isDeliveredByPlayer).reduce((sum, nextRg) => sum += nextRg.prestige, 0) ?? 0;
    }

    getPaxPercent() {
        return this.paxRg ? (this.paxRg.amountDelivered / this.paxRg.goalAmount) : 100;
    }

    getBestPpRatio(userId: string) {
        return this.allRgs.reduce((bestRatio, rg) => Math.max(bestRatio, rg.getBestTonnagePrestigeRatio(userId)), 0);
    }
}
