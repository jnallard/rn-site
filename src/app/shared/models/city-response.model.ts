import { Resource } from "./resource.model";

export interface CityResponse {
    Body: {
        StoragesInfo: {
            Incoming: number[],
            Storages: Resource[]
        }
        Level: number;
    };
}
