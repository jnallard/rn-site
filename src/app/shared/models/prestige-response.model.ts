import { PrestigeType } from "../enums/prestige-type.enum";

export interface PrestigeResponse {
    playerRank: 0,
    balance: {
        prestige: string,
        type: PrestigeType
    }[],
    ranking: {
        [type in PrestigeType]: number
    }
}
