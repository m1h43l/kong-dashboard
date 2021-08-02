export class AppEvent {
    action: AppEvent.Action;
    payload: any;

    constructor(action: AppEvent.Action, payload?: any) {
        this.action = action;
        this.payload = payload;
    }
}

export namespace AppEvent {
    export enum Action {
        Refresh = "refresh",
        ServiceDeleted = "service_deleted",
        ServiceCreated = "service_created",
        ServiceUpdated = "service_updated",
        RouteDeleted = "route_deleted",
        RouteCreated = "route_created",
        RouteUpdated = "route_updated",
        ConsumerCreated = "consumer_created",
        ConsumerDeleted = "consumer_deleted",
        ConsumerUpdated = "consumer_updated"
    }
}
