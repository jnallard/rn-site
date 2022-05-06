interface LevelDataImport {
  level: string,
  buildPrestige: string,
  timeBonus?: string,
  multiplier?: string,
};

export class LevelData {
  level: number;
  buildPrestige: number;
  timeBonus?: number;
  multiplier?: number;

  constructor(levelDataImport: LevelDataImport) {
    this.level = +levelDataImport.level;
    this.buildPrestige = +levelDataImport.buildPrestige;
    if (levelDataImport.timeBonus) {
      this.timeBonus = +levelDataImport.timeBonus.replace(',', '');
    }
    if (levelDataImport.multiplier) {
      this.multiplier = (+levelDataImport.multiplier.replace('+', '').replace('%', '') / 100) + 1.0;
    }
  }
}

// Generated using this: https://tableconvert.com/mediawiki-to-json and https://railnation.fandom.com/wiki/Restaurant?veaction=editsource
const restaurantLevels: LevelDataImport[] = [{ "level": "1", "buildPrestige": "0", "timeBonus": "2,000" }, { "level": "2", "buildPrestige": "2", "timeBonus": "2,500" }, { "level": "3", "buildPrestige": "5", "timeBonus": "3,500" }, { "level": "4", "buildPrestige": "8", "timeBonus": "4,750" }, { "level": "5", "buildPrestige": "12", "timeBonus": "6,500" }, { "level": "6", "buildPrestige": "18", "timeBonus": "8,500" }, { "level": "7", "buildPrestige": "26", "timeBonus": "11,000" }, { "level": "8", "buildPrestige": "34", "timeBonus": "14,000" }, { "level": "9", "buildPrestige": "45", "timeBonus": "18,000" }, { "level": "10", "buildPrestige": "55", "timeBonus": "23,000" }, { "level": "11", "buildPrestige": "66", "timeBonus": "28,000" }, { "level": "12", "buildPrestige": "78", "timeBonus": "35,000" }, { "level": "13", "buildPrestige": "90", "timeBonus": "42,000" }, { "level": "14", "buildPrestige": "105", "timeBonus": "50,000" }, { "level": "15", "buildPrestige": "120", "timeBonus": "58,000" }, { "level": "16", "buildPrestige": "130", "timeBonus": "67,000" }, { "level": "17", "buildPrestige": "140", "timeBonus": "76,000" }, { "level": "18", "buildPrestige": "150", "timeBonus": "85,000" }, { "level": "19", "buildPrestige": "160", "timeBonus": "95,000" }, { "level": "20", "buildPrestige": "170", "timeBonus": "105,000" }, { "level": "21", "buildPrestige": "180", "timeBonus": "115,000" }, { "level": "22", "buildPrestige": "190", "timeBonus": "125,000" }, { "level": "23", "buildPrestige": "200", "timeBonus": "135,000" }, { "level": "24", "buildPrestige": "220", "timeBonus": "150,000" }, { "level": "25", "buildPrestige": "240", "timeBonus": "165,000" }, { "level": "26", "buildPrestige": "260", "timeBonus": "180,000" }, { "level": "27", "buildPrestige": "280", "timeBonus": "195,000" }, { "level": "28", "buildPrestige": "300", "timeBonus": "210,000" }, { "level": "29", "buildPrestige": "350", "timeBonus": "225,000" }, { "level": "30", "buildPrestige": "400", "timeBonus": "240,000" }, { "level": "31", "buildPrestige": "500", "timeBonus": "250,000" }, { "level": "32", "buildPrestige": "600", "timeBonus": "260,000" }];
const shoppingCenterLevels: LevelDataImport[] = [{ "level": "1", "timeBonus": "4,000", "buildPrestige": "0" }, { "level": "2", "timeBonus": "5,500", "buildPrestige": "15" }, { "level": "3", "timeBonus": "7,500", "buildPrestige": "30" }, { "level": "4", "timeBonus": "10,000", "buildPrestige": "35" }, { "level": "5", "timeBonus": "12,500", "buildPrestige": "40" }, { "level": "6", "timeBonus": "15,000", "buildPrestige": "45" }, { "level": "7", "timeBonus": "18,000", "buildPrestige": "50" }, { "level": "8", "timeBonus": "23,000", "buildPrestige": "60" }, { "level": "9", "timeBonus": "29,000", "buildPrestige": "70" }, { "level": "10", "timeBonus": "37,000", "buildPrestige": "80" }, { "level": "11", "timeBonus": "45,000", "buildPrestige": "90" }, { "level": "12", "timeBonus": "54,000", "buildPrestige": "100" }, { "level": "13", "timeBonus": "66,000", "buildPrestige": "110" }, { "level": "14", "timeBonus": "78,000", "buildPrestige": "125" }, { "level": "15", "timeBonus": "95,000", "buildPrestige": "140" }, { "level": "16", "timeBonus": "110,000", "buildPrestige": "155" }, { "level": "17", "timeBonus": "125,000", "buildPrestige": "170" }, { "level": "18", "timeBonus": "140,000", "buildPrestige": "185" }, { "level": "19", "timeBonus": "155,000", "buildPrestige": "200" }, { "level": "20", "timeBonus": "170,000", "buildPrestige": "220" }, { "level": "21", "timeBonus": "190,000", "buildPrestige": "240" }, { "level": "22", "timeBonus": "210,000", "buildPrestige": "260" }, { "level": "23", "timeBonus": "230,000", "buildPrestige": "280" }, { "level": "24", "timeBonus": "250,000", "buildPrestige": "300" }, { "level": "25", "timeBonus": "270,000", "buildPrestige": "320" }, { "level": "26", "timeBonus": "290,000", "buildPrestige": "340" }, { "level": "27", "timeBonus": "310,000", "buildPrestige": "360" }, { "level": "28", "timeBonus": "325,000", "buildPrestige": "380" }, { "level": "29", "timeBonus": "340,000", "buildPrestige": "400" }, { "level": "30", "timeBonus": "355,000", "buildPrestige": "500" }, { "level": "31", "timeBonus": "365,000", "buildPrestige": "625" }, { "level": "32", "timeBonus": "375,000", "buildPrestige": "750" }];
const hotelLevels: LevelDataImport[] = [{ "level": "1", "timeBonus": "1", "multiplier": "+0%", "buildPrestige": "0" }, { "level": "2", "timeBonus": "2", "multiplier": "+5%", "buildPrestige": "2" }, { "level": "3", "timeBonus": "3", "multiplier": "+8%", "buildPrestige": "4" }, { "level": "4", "timeBonus": "4", "multiplier": "+10%", "buildPrestige": "6" }, { "level": "5", "timeBonus": "5", "multiplier": "+12%", "buildPrestige": "8" }, { "level": "6", "timeBonus": "6", "multiplier": "+15%", "buildPrestige": "10" }, { "level": "7", "timeBonus": "7", "multiplier": "+18%", "buildPrestige": "15" }, { "level": "8", "timeBonus": "8", "multiplier": "+21%", "buildPrestige": "20" }, { "level": "9", "timeBonus": "9", "multiplier": "+24%", "buildPrestige": "25" }, { "level": "10", "timeBonus": "10", "multiplier": "+27%", "buildPrestige": "30" }, { "level": "11", "timeBonus": "12", "multiplier": "+30%", "buildPrestige": "35" }, { "level": "12", "timeBonus": "14", "multiplier": "+33%", "buildPrestige": "40" }, { "level": "13", "timeBonus": "16", "multiplier": "+36%", "buildPrestige": "45" }, { "level": "14", "timeBonus": "18", "multiplier": "+38%", "buildPrestige": "50" }, { "level": "15", "timeBonus": "20", "multiplier": "+40%", "buildPrestige": "55" }, { "level": "16", "timeBonus": "22", "multiplier": "+42%", "buildPrestige": "60" }, { "level": "17", "timeBonus": "24", "multiplier": "+44%", "buildPrestige": "65" }, { "level": "18", "timeBonus": "26", "multiplier": "+46%", "buildPrestige": "70" }, { "level": "19", "timeBonus": "28", "multiplier": "+48%", "buildPrestige": "75" }, { "level": "20", "timeBonus": "30", "multiplier": "+50%", "buildPrestige": "80" }, { "level": "21", "timeBonus": "32", "multiplier": "+52%", "buildPrestige": "90" }, { "level": "22", "timeBonus": "34", "multiplier": "+54%", "buildPrestige": "100" }, { "level": "23", "timeBonus": "36", "multiplier": "+56%", "buildPrestige": "120" }, { "level": "24", "timeBonus": "38", "multiplier": "+58%", "buildPrestige": "140" }, { "level": "25", "timeBonus": "40", "multiplier": "+60%", "buildPrestige": "160" }, { "level": "26", "timeBonus": "42", "multiplier": "+60%", "buildPrestige": "180" }, { "level": "27", "timeBonus": "44", "multiplier": "+60%", "buildPrestige": "200" }, { "level": "28", "timeBonus": "46", "multiplier": "+60%", "buildPrestige": "250" }, { "level": "29", "timeBonus": "48", "multiplier": "+60%", "buildPrestige": "300" }, { "level": "30", "timeBonus": "50", "multiplier": "+60%", "buildPrestige": "350" }, { "level": "31", "timeBonus": "52", "multiplier": "+60%", "buildPrestige": "475" }, { "level": "32", "timeBonus": "55", "multiplier": "+60%", "buildPrestige": "600" }];
const engineHouseLevels: LevelDataImport[] = [{"level":"1","buildPrestige":"0"},{"level":"2","buildPrestige":"2"},{"level":"3","buildPrestige":"5"},{"level":"4","buildPrestige":"10"},{"level":"5","buildPrestige":"15"},{"level":"6","buildPrestige":"20"},{"level":"7","buildPrestige":"25"},{"level":"8","buildPrestige":"30"},{"level":"9","buildPrestige":"35"},{"level":"10","buildPrestige":"40"},{"level":"11","buildPrestige":"45"},{"level":"12","buildPrestige":"50"},{"level":"13","buildPrestige":"60"},{"level":"14","buildPrestige":"70"},{"level":"15","buildPrestige":"80"},{"level":"16","buildPrestige":"90"},{"level":"17","buildPrestige":"100"},{"level":"18","buildPrestige":"110"},{"level":"19","buildPrestige":"120"},{"level":"20","buildPrestige":"130"},{"level":"21","buildPrestige":"140"},{"level":"22","buildPrestige":"150"},{"level":"23","buildPrestige":"160"},{"level":"24","buildPrestige":"180"},{"level":"25","buildPrestige":"200"}];
const labLevels: LevelDataImport[] = [{ "level": "1", "buildPrestige": "0" }, { "level": "2", "buildPrestige": "2" }, { "level": "3", "buildPrestige": "5" }, { "level": "4", "buildPrestige": "10" }, { "level": "5", "buildPrestige": "15" }, { "level": "6", "buildPrestige": "20" }, { "level": "7", "buildPrestige": "25" }, { "level": "8", "buildPrestige": "30" }, { "level": "9", "buildPrestige": "40" }, { "level": "10", "buildPrestige": "50" }, { "level": "11", "buildPrestige": "75" }, { "level": "12", "buildPrestige": "100" }, { "level": "13", "buildPrestige": "125" }, { "level": "14", "buildPrestige": "150" }, { "level": "15", "buildPrestige": "200" }, { "level": "16", "buildPrestige": "250" }, { "level": "17", "buildPrestige": "300" }, { "level": "18", "buildPrestige": "350" }, { "level": "19", "buildPrestige": "400" }, { "level": "20", "buildPrestige": "450" }, { "level": "21", "buildPrestige": "500" }, { "level": "22", "buildPrestige": "550" }, { "level": "23", "buildPrestige": "600" }, { "level": "24", "buildPrestige": "700" }, { "level": "25", "buildPrestige": "800" }];
const bankLevels: LevelDataImport[] = [{ "level": "1", "buildPrestige": "0" }, { "level": "2", "buildPrestige": "2" }, { "level": "3", "buildPrestige": "4" }, { "level": "4", "buildPrestige": "6" }, { "level": "5", "buildPrestige": "8" }, { "level": "6", "buildPrestige": "10" }, { "level": "7", "buildPrestige": "15" }, { "level": "8", "buildPrestige": "20" }, { "level": "9", "buildPrestige": "25" }, { "level": "10", "buildPrestige": "30" }, { "level": "11", "buildPrestige": "35" }, { "level": "12", "buildPrestige": "40" }, { "level": "13", "buildPrestige": "45" }, { "level": "14", "buildPrestige": "50" }, { "level": "15", "buildPrestige": "55" }, { "level": "16", "buildPrestige": "60" }, { "level": "17", "buildPrestige": "65" }, { "level": "18", "buildPrestige": "70" }, { "level": "19", "buildPrestige": "85" }, { "level": "20", "buildPrestige": "100" }, { "level": "21", "buildPrestige": "125" }, { "level": "22", "buildPrestige": "150" }, { "level": "23", "buildPrestige": "175" }, { "level": "24", "buildPrestige": "200" }, { "level": "25", "buildPrestige": "250" }, { "level": "26", "buildPrestige": "300" }, { "level": "27", "buildPrestige": "350" }, { "level": "28", "buildPrestige": "400" }, { "level": "29", "buildPrestige": "450" }, { "level": "30", "buildPrestige": "500" }];
const stationConcourseLevels: LevelDataImport[] = [{ "level": "1", "buildPrestige": "0" }, { "level": "2", "buildPrestige": "25" }, { "level": "3", "buildPrestige": "35" }, { "level": "4", "buildPrestige": "50" }, { "level": "5", "buildPrestige": "75" }, { "level": "6", "buildPrestige": "100" }, { "level": "7", "buildPrestige": "150" }, { "level": "8", "buildPrestige": "200" }, { "level": "9", "buildPrestige": "300" }, { "level": "10", "buildPrestige": "400" }, { "level": "11", "buildPrestige": "500" }, { "level": "12", "buildPrestige": "750" }, { "level": "13", "buildPrestige": "1000" }, { "level": "14", "buildPrestige": "1250" }, { "level": "15", "buildPrestige": "1500" }, { "level": "16", "buildPrestige": "1750" }, { "level": "17", "buildPrestige": "2000" }, { "level": "18", "buildPrestige": "2250" }, { "level": "19", "buildPrestige": "2500" }, { "level": "20", "buildPrestige": "3000" }, { "level": "21", "buildPrestige": "3500" }, { "level": "22", "buildPrestige": "4000" }];
const trackProductionLevels: LevelDataImport[] = [{ "level": "1", "buildPrestige": "0" }, { "level": "2", "buildPrestige": "2" }, { "level": "3", "buildPrestige": "5" }, { "level": "4", "buildPrestige": "10" }, { "level": "5", "buildPrestige": "15" }, { "level": "6", "buildPrestige": "20" }, { "level": "7", "buildPrestige": "25" }, { "level": "8", "buildPrestige": "30" }, { "level": "9", "buildPrestige": "35" }, { "level": "10", "buildPrestige": "40" }, { "level": "11", "buildPrestige": "45" }, { "level": "12", "buildPrestige": "50" }, { "level": "13", "buildPrestige": "60" }, { "level": "14", "buildPrestige": "70" }, { "level": "15", "buildPrestige": "80" }, { "level": "16", "buildPrestige": "90" }, { "level": "17", "buildPrestige": "100" }, { "level": "18", "buildPrestige": "110" }, { "level": "19", "buildPrestige": "120" }, { "level": "20", "buildPrestige": "130" }, { "level": "21", "buildPrestige": "140" }, { "level": "22", "buildPrestige": "150" }, { "level": "23", "buildPrestige": "160" }, { "level": "24", "buildPrestige": "180" }, { "level": "25", "buildPrestige": "200" }, { "level": "26", "buildPrestige": "225" }, { "level": "27", "buildPrestige": "250" }, { "level": "28", "buildPrestige": "300" }, { "level": "29", "buildPrestige": "375" }, { "level": "30", "buildPrestige": "450" }];
const constructionYardLevels: LevelDataImport[] = [{ "level": "1", "buildPrestige": "0" }, { "level": "2", "buildPrestige": "2" }, { "level": "3", "buildPrestige": "4" }, { "level": "4", "buildPrestige": "6" }, { "level": "5", "buildPrestige": "8" }, { "level": "6", "buildPrestige": "10" }, { "level": "7", "buildPrestige": "12" }, { "level": "8", "buildPrestige": "14" }, { "level": "9", "buildPrestige": "16" }, { "level": "10", "buildPrestige": "18" }, { "level": "11", "buildPrestige": "20" }, { "level": "12", "buildPrestige": "24" }, { "level": "13", "buildPrestige": "28" }, { "level": "14", "buildPrestige": "32" }, { "level": "15", "buildPrestige": "36" }, { "level": "16", "buildPrestige": "40" }, { "level": "17", "buildPrestige": "45" }, { "level": "18", "buildPrestige": "50" }, { "level": "19", "buildPrestige": "55" }, { "level": "20", "buildPrestige": "60" }, { "level": "21", "buildPrestige": "70" }, { "level": "22", "buildPrestige": "80" }, { "level": "23", "buildPrestige": "90" }, { "level": "24", "buildPrestige": "100" }, { "level": "25", "buildPrestige": "120" }, { "level": "26", "buildPrestige": "140" }, { "level": "27", "buildPrestige": "160" }, { "level": "28", "buildPrestige": "180" }, { "level": "29", "buildPrestige": "200" }, { "level": "30", "buildPrestige": "300" }];
const licenseTraderLevels: LevelDataImport[] = [{ "level": "1", "buildPrestige": "0" }, { "level": "2", "buildPrestige": "10" }, { "level": "3", "buildPrestige": "25" }, { "level": "4", "buildPrestige": "50" }, { "level": "5", "buildPrestige": "100" }, { "level": "6", "buildPrestige": "150" }];


export interface BuildingDictionary { [id: number]: StaticBuilding };

export class StaticBuilding {
  public levelData: LevelData[];

  constructor(public name: string, public id: number, public maxLevel: number, levelDataImport: LevelDataImport[]) { 
    this.levelData = levelDataImport.map(ld => new LevelData(ld));
  }

  getPrestigeLeft(level: number) {
    const nextLevel = this.levelData.findIndex(ld => ld.level === level) + 1;
    let prestigeRemaining = 0;
    for(let i = nextLevel; i < this.levelData.length; i++) {
      prestigeRemaining += this.levelData[i].buildPrestige;
    }
    return prestigeRemaining;
  }

  getDailyBonus(level: number, multiplier: number, periodMinutes: number) {
    const minutesInDay = 1440;
    const countPerDay = Math.floor(minutesInDay / periodMinutes);
    const timeBonus = this.levelData.find(ld => ld.level === level).timeBonus;
    const result = Math.floor(timeBonus * multiplier * countPerDay);
    return result;
  }
}

export const Restaurant = new StaticBuilding('Restaurant', 8, 32, restaurantLevels);
export const ShoppingCenter = new StaticBuilding('Shopping Center', 9, 32, shoppingCenterLevels);
export const Hotel = new StaticBuilding('Hotel', 7, 32, hotelLevels);
export const EngineHouse = new StaticBuilding('Engine House', 0, 25, engineHouseLevels);
export const Laboratory = new StaticBuilding('Laboratory', 6, 25, labLevels);
export const Bank = new StaticBuilding('Bank', 4, 30, bankLevels);
export const StationConcourse = new StaticBuilding('Station Concourse', 1, 22, stationConcourseLevels);
export const TrackProduction = new StaticBuilding('Track Production', 2, 30, trackProductionLevels);
export const ConstructionYard = new StaticBuilding('Construction Yard', 3, 30, constructionYardLevels);
export const LicenseTrader = new StaticBuilding('License Trader', 5, 6, licenseTraderLevels);

export class StaticBuildingData {
  public static AllBuildings = [
    Restaurant,
    ShoppingCenter,
    Hotel,
    EngineHouse,
    Laboratory,
    Bank,
    StationConcourse,
    TrackProduction,
    ConstructionYard,
    LicenseTrader,
  ];

  public static getBuildingDictionary() {
    let dict = {} as BuildingDictionary;
    this.AllBuildings.forEach((city) => dict[city.id] = city);
    return dict;
  }
}