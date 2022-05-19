import { Component, OnInit } from '@angular/core';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction } from 'rxjs';
import { distinctUntilChanged, mergeMap, timeout } from 'rxjs/operators';
import { SearchResponse } from '../../models/search-response.model';
import { AccountService } from '../../services/account.service';
import { CorpService } from '../../services/corp.service';
import { PlayerService } from '../../services/player.service';
import { Player } from '../../types/player.type';

@Component({
  selector: 'app-ids-selector',
  templateUrl: './ids-selector.component.html',
  styleUrls: ['./ids-selector.component.css']
})
export class IdsSelectorComponent implements OnInit {
  private readonly defaultGroup = 'Please Select';
  selectorVisible = false;
  groupPick = this.defaultGroup;
  players: Player[] = [];
  
  myCorpId: string;
  isLoading = true;
  playerSearchText = '';
  corpSearchText = '';
  get isReady() {
    return this.getSelectedPlayers().length > 0;
  }


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
    this.isLoading = false;
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

  async loadCorp(id: string) {
    this.isLoading = true;
    const corp = await this.getCorpDetails(id);
    this.updateGroupPick(corp.name);
    await this.addPlayers(corp.memberIds);
    this.isLoading = false;
  }

  async loadMyCorp() {
    await this.loadCorp(this.myCorpId);
  }

  async loadTop20() {
    this.isLoading = true;
    this.updateGroupPick('Top 20');
    let topPlayers = await this.playerService.getTopPlayers(0, 19).toPromise();
    await this.addPlayers(topPlayers.highscore.map(x => x["0"]));
    this.isLoading = false;
  }

  async addPlayers(userIds: string[]) {
    const newPlayers = await this.getUserNames(userIds) as Player[];
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

  searchPlayers: OperatorFunction<string, readonly SearchResponse[]> = (text$: Observable<string>) => {
    return text$.pipe(
      distinctUntilChanged(),
      mergeMap(term => this.accountService.searchPlayers(term))
    )
  }

  searchPlayersFormatter = (result: SearchResponse) => result.name;

  async selectedFoundPlayer(event: NgbTypeaheadSelectItemEvent) {
    const player = event.item as SearchResponse;
    event.preventDefault();
    this.playerSearchText = '';
    await this.addPlayers([player.id]);
    this.updateGroupPick(player.name);
    await new Promise(r => setTimeout(r, 10));
  }

  searchCorps: OperatorFunction<string, readonly SearchResponse[]> = (text$: Observable<string>) => {
    return text$.pipe(
      distinctUntilChanged(),
      mergeMap(term => this.corpService.searchCorps(term))
    )
  }

  searchCorpsFormatter = (result: SearchResponse) => result.name;

  async selectedFoundCorp(event: NgbTypeaheadSelectItemEvent) {
    const corp = event.item as SearchResponse;
    event.preventDefault();
    this.corpSearchText = '';
    await this.loadCorp(corp.id);
    this.updateGroupPick(corp.name);
    await new Promise(r => setTimeout(r, 10));
  }
}
