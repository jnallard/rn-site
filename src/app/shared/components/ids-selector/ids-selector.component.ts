import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ids-selector',
  templateUrl: './ids-selector.component.html',
  styleUrls: ['./ids-selector.component.css']
})
export class IdsSelectorComponent implements OnInit {
  selectorVisible = false;
  groupPick = 'My Corp'

  constructor() { }

  init(): void {
  }

  ngOnInit(): void {
  }

}
