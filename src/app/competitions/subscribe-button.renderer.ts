import { Component } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { Comp } from "../shared/models/comp.model";

@Component({
    selector: 'subscribe-button-renderer',
    template: `
      <button *ngIf="!isSubscribed" class='btn btn-light btn-block btn-sm mt-1' (click)="subscribe($event)">Subscribe</button>
      <button *ngIf="isSubscribed" class='btn btn-success btn-block btn-sm mt-1' (click)="unsubscribe($event)">Subscribed!</button>
    `,
})
export class SubscribeButtonRenderer implements ICellRendererAngularComp {
    private comp: Comp;
    private clicked: (comp: Comp) => void;

    private static readonly subscribedComps: string[] = [];
    public static isCompSubscribed(comp: Comp) {
        return SubscribeButtonRenderer.subscribedComps.includes(comp.id);
    }

    get isSubscribed() {
        return SubscribeButtonRenderer.isCompSubscribed(this.comp);
    }

    agInit(params: any): void {
        this.comp = params.data;
        this.clicked = params.clicked;
    }

    subscribe() {
        SubscribeButtonRenderer.subscribedComps.push(this.comp.id)
        this.clicked(this.comp);
    }

    unsubscribe() {
        SubscribeButtonRenderer.subscribedComps.splice(SubscribeButtonRenderer.subscribedComps.indexOf(this.comp.id, 1));
        this.clicked(this.comp);
    }

    refresh(): boolean {
        return true;
    }
}