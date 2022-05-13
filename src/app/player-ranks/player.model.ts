import { Observable } from "rxjs";
import { PrestigeHistory } from "./prestige-history.model";

export class Player {

    totalPrestige: Observable<PrestigeHistory>;
    todayPrestige: Observable<PrestigeHistory>;
    yesterdayPrestige: Observable<PrestigeHistory>;
    era1Prestige: Observable<PrestigeHistory>;
    era2Prestige: Observable<PrestigeHistory>;
    era3Prestige: Observable<PrestigeHistory>;
    era4Prestige: Observable<PrestigeHistory>;
    era5Prestige: Observable<PrestigeHistory>;
    era6Prestige: Observable<PrestigeHistory>;
    endGamePrestige: Observable<PrestigeHistory>;

    constructor(public username: string, public id: string) {
    }
}