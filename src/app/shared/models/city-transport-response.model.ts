import { Resource } from "./resource.model";

export interface CityTransportResponse {
    Result: {
        Amount: number,
        UserId: string,
        Position: number,
        Prestige: number,
    }[]
}
