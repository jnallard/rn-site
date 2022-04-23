import { Resource } from "./resource.model";

export interface CityResponse {
    StoragesInfo: {
        Incoming: number[],
        Storages: Resource[]
    }
    Level: number;
}
