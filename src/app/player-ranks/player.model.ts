import { PrestigeHistory } from "./prestige-history.model";

export class Player {

    totalPrestige: PrestigeHistory;
    todayPrestige: PrestigeHistory;
    yesterdayPrestige: PrestigeHistory;

    constructor(public username: string, public id: string) {
    }
}