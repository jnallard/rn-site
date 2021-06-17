import { CityResponse } from "../shared/models/city-response.model";
import { RequiredGood } from "./required-good.model";
import { Md5 } from 'ts-md5/dist/md5';

export class City {
    rgs: RequiredGood[] | null = null;
    hash: string;

    constructor(public name: string, public id: string) {
        this.hash = Md5.hashAsciiStr(`["${id}"]`);
    }

    setCityResponse(cityResponse: CityResponse) {
        this.rgs = cityResponse.Body.StoragesInfo.Incoming.filter(x => x != 49).slice(-4).map(rg => {
            const storage = cityResponse.Body.StoragesInfo.Storages.find(st => st.ResourceId === rg);
            return new RequiredGood(storage!);
        });
    }

    getPercentDone() {
        if(!this.rgs) {
            return -1;
        }
        return Math.round(this.rgs.reduce((sum, nextRg) => sum += nextRg.percentDelivered, 0) / this.rgs.length);
    }
}