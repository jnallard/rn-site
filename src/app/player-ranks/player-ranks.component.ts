import { Component, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { PrestigeFilterType } from '../shared/enums/prestige-filter-type.enum';
import { PlayerService } from '../shared/services/player.service';
import { Player } from './player.model';
import { PrestigeHistory } from './prestige-history.model';

@Component({
  selector: 'app-player-ranks',
  templateUrl: './player-ranks.component.html',
  styleUrls: ['./player-ranks.component.css']
})
export class PlayerRanksComponent implements OnInit {

  constructor(private playerService: PlayerService) { }

  players: Player[] = [];

  prestigeFilter = PrestigeFilterType.AllTime;

  filterOptions = [
    { display: 'All Time', type: PrestigeFilterType.AllTime },
    { display: 'Today', type: PrestigeFilterType.Today },
    { display: 'Yesterday', type: PrestigeFilterType.Yesterday },
  ]

  ngOnInit(): void {
    from(this.getPlayers()).subscribe(players => console.log(players), error => console.error(error));
  }

  async getPlayers() {
    let topPlayers = await this.playerService.getTopPlayers(0, 19).toPromise();
    console.log(topPlayers);
    let profiles = await this.playerService.getPlayerProfiles(topPlayers.Body.highscore.map(x => x["0"])).toPromise();
    console.log(profiles);

    var players = topPlayers.Body.highscore.map(id => {
      const profile = profiles.Body[id[0]];
      console.log(profile);
      const player = new Player(profile.userName, id[0]);
      this.players.push(player);
      return player;
    });
    for(let player of players) {
      await this.getPlayerPrestige(player);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }

  async getPlayerPrestige(player: Player) {
    let prestige = await this.playerService.getPrestigeHistory(player.id, PrestigeFilterType.AllTime).toPromise();
    player.totalPrestige = new PrestigeHistory(prestige);
    prestige = await this.playerService.getPrestigeHistory(player.id, PrestigeFilterType.Today).toPromise();
    player.todayPrestige = new PrestigeHistory(prestige);
    prestige = await this.playerService.getPrestigeHistory(player.id, PrestigeFilterType.Yesterday).toPromise();
    player.yesterdayPrestige = new PrestigeHistory(prestige);
  }

  getFilteredPrestige(player: Player) {
    switch(this.prestigeFilter) {
      case PrestigeFilterType.AllTime:
        return player.totalPrestige;
      case PrestigeFilterType.Today:
        return player.todayPrestige;
      case PrestigeFilterType.Yesterday:
        return player.yesterdayPrestige;
    }
  }

  getRankClass(rank: number) {
    if(rank == 1) {
      return 'bg-success';
    }
    if(rank == 2) {
      return 'bg-primary';
    }
    if(rank == 3) {
      return 'bg-info';
    }
    if(rank <= 10) {
      return 'bg-secondary';
    }
    return 'bg-light text-dark';
  }

}
