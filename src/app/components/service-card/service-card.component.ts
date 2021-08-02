import {Component, Input, OnInit} from "@angular/core";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AppEvent} from "@app/events/AppEvent";
import {Service} from "@app/models/Service";
import {EventService} from "@app/services/event.service";
import {ServiceService} from "@app/services/service.service";
import {ServiceDialogComponent} from "../service-dialog/service-dialog.component";
import {ToastrService} from "ngx-toastr";
import {AssignedRoutesDialogComponent} from "../assigned-routes-dialog/assigned-routes-dialog.component";

@Component({
    selector: "app-service-card",
    templateUrl: "./service-card.component.html",
    styleUrls: ["./service-card.component.scss"]
})
export class ServiceCardComponent implements OnInit {
    @Input() service: Service;
    waitingForDeleteConfirmation: boolean;

    constructor(
        private eventService: EventService,
        private serviceService: ServiceService,
        private toastr: ToastrService,
        private dialog: MatDialog,
        private window: Window
    ) {}

    ngOnInit(): void {}

    onDeleteService(): void {
        this.waitingForDeleteConfirmation = true;
        setTimeout(() => {
            if (this.waitingForDeleteConfirmation) this.waitingForDeleteConfirmation = false;
        }, 3000);
    }

    onConfirmDelete(): void {
        this.waitingForDeleteConfirmation = false;

        this.serviceService.delete(this.service).subscribe(
            (response) => {
                this.toastr.success("Deleted service " + this.service.name);
                this.eventService.send(new AppEvent(AppEvent.Action.ServiceDeleted, this.service));
            },
            (error) => this.toastr.error("Could not delete service.")
        );
    }

    onEditService(): void {
        const options = new MatDialogConfig();
        options.disableClose = false;
        options.autoFocus = true;
        options.data = {service: Object.assign({}, this.service)}; // TODO no deep clone yet

        this.dialog.open(ServiceDialogComponent, options);
    }

    onShowAssignedRoutes(): void {
        const options = new MatDialogConfig();
        options.disableClose = false;
        options.autoFocus = true;
        options.data = {service: this.service};

        this.dialog.open(AssignedRoutesDialogComponent, options);
    }

    onCopyServiceUrl(): void {
        if (this.window.navigator.clipboard)
            this.window.navigator.clipboard.writeText(this.buildServiceUrl());
        else this.toastr.warning("Navigator Clipboard API is not supported by this browser.");
    }

    private buildServiceUrl(): string {
        const url = this.service.protocol + "://" + this.service.host + ":" + this.service.port;
        if (this.service.path) return url + this.service.path;
        else return url;
    }
}
