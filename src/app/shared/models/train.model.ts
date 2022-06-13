import { StaticCity } from "../data/static-city.data";

export interface Train {
    id: string;
    name: string;
    schedule: {
        city: StaticCity;
        unloadedResource: string;
    }[];
};
