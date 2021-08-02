import {AppEvent} from "@app/events/AppEvent";
import {Injectable, EventEmitter} from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class EventService {
    private eventBroker: EventEmitter<AppEvent> = new EventEmitter<AppEvent>();

    constructor() {}

    send(event: AppEvent): void {
        this.eventBroker.emit(event);
    }

    subscribe(nextHandler: any, errorHandler?: any, completeHandler?: any): any {
        return this.eventBroker.subscribe(nextHandler, errorHandler, completeHandler);
    }
}
