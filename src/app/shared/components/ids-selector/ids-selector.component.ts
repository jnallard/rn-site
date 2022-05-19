import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { CorpService } from '../../services/corp.service';
import { PlayerService } from '../../services/player.service';

type SelecatablePlayer = { id: string, name: string, selected?: boolean };

@Component({
  selector: 'app-ids-selector',
  templateUrl: './ids-selector.component.html',
  styleUrls: ['./ids-selector.component.css']
})
export class IdsSelectorComponent implements OnInit {
  private readonly defaultGroup = 'Please Select';
  selectorVisible = false;
  groupPick = this.defaultGroup;
  players: SelecatablePlayer[] = [];
  
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
    const corp = await this.getCorpDetails(this.myCorpId);
    this.updateGroupPick(corp.name);
    await this.addPlayers(corp.members);
    this.isLoading = false;
  }

  async loadTop20() {
    this.isLoading = true;
    this.updateGroupPick('Top 20');
    let topPlayers = await this.playerService.getTopPlayers(0, 19).toPromise();
    await this.addPlayers(topPlayers.highscore.map(x => x["0"]));
    this.isLoading = false;
  }

  async addPlayers(userIds: string[]) {
    const newPlayers = await this.getUserNames(userIds) as SelecatablePlayer[];
    newPlayers.forEach(player => player.selected = true);
    this.players = this.players
      .filter(player => !newPlayers.find(newPlayer => player.id === newPlayer.id))
      .concat(newPlayers);
    
  }

  updateGroupPick(group: string) {
    this.groupPick = this.groupPick === this.defaultGroup ? group : `${this.groupPick}, ${group}`.replace(`${group}, `, '');
  }

  getSelectedPlayers() {
    return this.players.filter(player => player.selected);
  }

  reset() {
    this.players = [];
    this.groupPick = this.defaultGroup;
  }

}
