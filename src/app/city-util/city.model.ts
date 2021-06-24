import { CityResponse } from "../shared/models/city-response.model";
import { RequiredGood } from "./required-good.model";
import { Md5 } from 'ts-md5/dist/md5';

export class City {
    rgs: RequiredGood[] | null = null;
    paxRg: RequiredGood;
    hash: string;
    loading = false;

    get selected(): boolean {
        return localStorage.getItem(`city-selected-${this.name}`) == 'true';
    }
    set selected(value: boolean) {
        localStorage.setItem(`city-selected-${this.name}`, value ? 'true' : 'false');
    }

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
        this.rgs = cityResponse.Body.StoragesInfo.Incoming.filter(x => x != 49).slice(-4).map(rg => {
            const storage = cityResponse.Body.StoragesInfo.Storages.find(st => st.ResourceId === rg);
            return new RequiredGood(storage!);
        });
        let paxStorage = cityResponse.Body.StoragesInfo.Storages.find(st => st.ResourceId === 49);
        if(paxStorage) {
            this.paxRg = new RequiredGood(paxStorage!);
        }
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
}