import { Resource } from "./resource.model";

export interface CityTransportResponse {
    Body: {
        Result: {
            Position: number,
            Prestige: number,
        }[]
    };
}
