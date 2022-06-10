import { Component } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";
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

    get isSubscribed() {
        return SubscribeButtonRenderer.subscribedComps.includes(this.comp.id);
    }


    agInit(params: any): void {
        this.comp = params.data;
        this.clicked = params.clicked;
    }

    subscribe(event: any) {
        this.clicked(this.comp);
        SubscribeButtonRenderer.subscribedComps.push(this.comp.id)
        new Notification('test');
    }

    unsubscribe(event: any) {
        this.clicked(this.comp);
        SubscribeButtonRenderer.subscribedComps.splice(SubscribeButtonRenderer.subscribedComps.indexOf(this.comp.id, 1));
        new Notification('test');
    }

    refresh(params: ICellRendererParams): boolean {
        return true;
    }
}