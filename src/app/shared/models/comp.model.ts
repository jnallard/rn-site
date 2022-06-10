import { CityDictionary } from "../data/static-city.data";
import { StaticResourceData } from "../data/static-resource.data";

export enum CompStatus {
  Waiting,
  Started,
  Expired,
  Complete,
}

export class Comp {

    private readonly rewardTypes = {
      0: 'Money',
      1: 'Gold/Plus',
      2: 'Prestige',
      3: 'Research',
      9: 'Lottery',
      11: 'License',
      70: 'Cargo Train',
    };

    id: string;
    city: string;
    resource: string;
    amount: number;
    startTime: Date;
    startsIn: Date;
    duration: number;
    durationLeft: number;
    rewardType: string;
    rewardMoney: number;
    rewardPrestige: number;
    originalResponse: any;
    playerAccepted: boolean;
    playerCompleted: boolean;
    playerAmount: number;
    playerPosition: number;
    status: CompStatus;

    constructor(compResponse: any, userId: string, cityDict: CityDictionary) {
      const now = new Date();
      const startTime = new Date();
      startTime.setSeconds(now.getSeconds() + compResponse.StartTime as number);
      const rewardType = this.rewardTypes[Object.keys(compResponse.Rewards).find(type => type !== '0')] ?? 'Unknown';
      const participant = compResponse.Participants[userId];
      this.id = compResponse.Id;
      this.city = cityDict[compResponse.LocationId]?.name,
      this.resource = StaticResourceData.getResource(compResponse.Resource),
      this.amount = compResponse.RequiredAmount,
      this.startTime = startTime;
      this.startsIn = startTime,
      this.duration = compResponse.Duration as number,
      this.rewardType = rewardType,
      this.rewardMoney = compResponse.Rewards[0] as number,
      this.rewardPrestige = compResponse.Rewards[2] as number,
      this.originalResponse = compResponse,
      this.playerAccepted = participant.Accepted,
      this.playerCompleted = participant.Completed,
      this.playerAmount = participant.Amount;
      this.playerPosition = participant.Place > 0 ? participant.Place : '';
      this.update();
  }

  getSecondsRemainingUntilStart() {
    return (this.startTime.getTime() - new Date().getTime()) / 1000;
  }

  update() {
    // durationLeft
    let duration = this.duration;
    if (!duration) {
      return '';
    }
    const secondsFromStartTime = this.getSecondsRemainingUntilStart();
    if(secondsFromStartTime < 0) {
      duration += secondsFromStartTime;
    }
    this.durationLeft = duration;

    // status
    if(this.playerCompleted) {
      this.status = CompStatus.Complete;
    }
    else if(this.durationLeft <= 0) {
      this.status = CompStatus.Expired;
    }
    else if(this.getSecondsRemainingUntilStart() <= 0) {
      this.status = CompStatus.Started;
    } else {
      this.status = CompStatus.Waiting;
    }
  }
}