import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { CorpService } from '../../services/corp.service';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-ids-selector',
  templateUrl: './ids-selector.component.html',
  styleUrls: ['./ids-selector.component.css']
})
export class IdsSelectorComponent implements OnInit {
  selectorVisible = false;
  groupPick = 'My Corporation'
  selectedPlayers: { id: string, name: string }[] = [];
  
  myCorpId: string;
  isLoading = true;


  constructor(
    private accountService: AccountService,
    private playerService: PlayerService,
    private corpService: CorpService,
  ) { }

  ngOnInit(): void {
    this.loadInitialData().then();
  }

  async loadInitialData() {
    const account = await this.getAccount();
    this.myCorpId = account.corpId;
    await this.loadMyCorp();
  }

  async getAccount() {
    return await this.accountService.getMyProfile().toPromise();
  }

  async getCorpDetails(corpId: string) {
    return await this.corpService.getCorpDetails(corpId).toPromise();
  }

  async getUserNames(userIds: string[]) {
    return await this.playerService.getUsers(userIds).toPromise();
  }

  async loadMyCorp() {
    this.isLoading = true;
    this.selectedPlayers = [];
    const corp = await this.getCorpDetails(this.myCorpId);
    this.groupPick = corp.name;
    const userIds = corp.members;
    this.selectedPlayers = await this.getUserNames(userIds);
    this.isLoading = false;
  }

  async loadTop20() {
    this.isLoading = true;
    this.selectedPlayers = [];
    this.groupPick = 'Top 20';
    let topPlayers = await this.playerService.getTopPlayers(0, 19).toPromise();
    this.selectedPlayers = await this.playerService.getUsers(topPlayers.highscore.map(x => x["0"])).toPromise();
    this.isLoading = false;
  }

}
