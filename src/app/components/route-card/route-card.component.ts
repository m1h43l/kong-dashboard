import {Component, Input, OnInit} from "@angular/core";
import {EventService} from "@app/services/event.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {Route} from "@app/models/Route";
import {RouteService} from "@app/services/route.service";
import {ToastrService} from "ngx-toastr";
import {AppEvent} from "@app/events/AppEvent";
import {RouteDialogComponent} from "../route-dialog/route-dialog.component";

@Component({
    selector: "app-route-card",
    templateUrl: "./route-card.component.html",
    styleUrls: ["./route-card.component.scss"]
})
export class RouteCardComponent implements OnInit {
    @Input() route: Route;
    waitingForDeleteConfirmation: boolean;

    constructor(
        private eventService: EventService,
        private routeService: RouteService,
        private toastr: ToastrService,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {}

    onDeleteRoute(): void {
        this.waitingForDeleteConfirmation = true;
        setTimeout(() => {
            if (this.waitingForDeleteConfirmation) this.waitingForDeleteConfirmation = false;
        }, 3000);
    }

    onConfirmDelete(): void {
        this.waitingForDeleteConfirmation = false;

        this.routeService.delete(this.route).subscribe(
            (response) => {
                this.toastr.success(
                    "Deleted route " + (this.route.name ? this.route.name : this.route.id)
                );
                this.eventService.send(new AppEvent(AppEvent.Action.RouteDeleted, this.route));
            },
            (error) => this.toastr.error("Could not delete service.")
        );
    }

    onEditRoute(): void {
        const options = new MatDialogConfig();
        options.disableClose = false;
        options.autoFocus = true;
        options.data = {route: this.failsafeRoute(this.route)}; // TODO clone route

        this.dialog.open(RouteDialogComponent, options);
    }

    failsafeRoute(route: Route): Route {
        if (!route.methods) route.methods = [];
        if (!route.hosts) route.hosts = [];
        if (!route.paths) route.paths = [];
        if (!route.sources) route.sources = [];
        if (!route.destinations) route.destinations = [];
        if (!route.snis) route.snis = [];
        if (!route.tags) route.tags = [];
        if (!route.headers) route.headers = [];

        return route;
    }
}
