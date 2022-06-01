import { ServerInfo } from "../models/server-info.model";
import { classicCities, europeCities, usaCities } from "./cities-json/cities";
import { CityTranslation, translations } from "./cities-json/translations";

export interface CityDictionary { [id: string]: StaticCity };

export class StaticCity {
    public name: string;
    constructor(name: string, public id: string, public indexId: number, translations: CityTranslation[], townNamePackage: string) {
        this.name = translations.find(x => +x.cityIndex === this.indexId && x.townPackage === townNamePackage)?.cityName ?? name;
    }
}

export class StaticCityData {
    public static getAllCities(serverInfo: ServerInfo) {
        let cities = classicCities;
        let townNamePackage = serverInfo.townNamePackage;
        switch(serverInfo.scenario) {
            case 'europe':
                cities = europeCities;
                townNamePackage = '-1';
                break;
            case 'usa':
                cities = usaCities;
                townNamePackage = '-1';
                break;
        }
        return cities.map(x => new StaticCity(x.name, x.id, x.indexId, translations, townNamePackage));
    }

    public static getCityDictionary(serverInfo: ServerInfo) {
        let dict = {} as CityDictionary;
        this.getAllCities(serverInfo).forEach((city) => dict[city.id] = city);
        return dict;
    }
}
