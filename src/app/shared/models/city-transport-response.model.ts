import { Resource } from "./resource.model";

export interface CityTransportResponse {
    Result: {
        Position: number,
        Prestige: number,
    }[]
}
