import { PrestigeType } from "../enums/prestige-type.enum";

export interface PrestigeResponse {
    playerRank: 0,
    balance: {
        prestige: number,
        type: PrestigeType
    }[],
    ranking: {
        [type in PrestigeType]: number
    }
}
