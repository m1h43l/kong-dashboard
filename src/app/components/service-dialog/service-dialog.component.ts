import {AppEvent} from "@app/events/AppEvent";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {Component, Inject, OnInit} from "@angular/core";
import {EventService} from "@app/services/event.service";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Service} from "@app/models/Service";
import {ServiceService} from "@app/services/service.service";
import {ToastrService} from "ngx-toastr";
import {Observable} from "rxjs";

@Component({
    selector: "app-service-dialog",
    templateUrl: "./service-dialog.component.html",
    styleUrls: ["./service-dialog.component.scss"]
})
export class ServiceDialogComponent implements OnInit {
    readonly separatorKeysCodes = [ENTER, COMMA] as const;
    readonly truthy: boolean = true;

    service: Service;
    newTag: string;

    constructor(
        private eventService: EventService,
        private serviceService: ServiceService,
        private toastr: ToastrService,
        private dialogRef: MatDialogRef<ServiceDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data
    ) {
        this.service = data.service;
        if (!this.service.tags) this.service.tags = [];
    }

    ngOnInit(): void {}

    cancel(): void {
        this.dialogRef.close();
    }

    ok(): void {
        let serviceObservable: Observable<Service>;
        if (this.service.id) serviceObservable = this.serviceService.persist(this.service);
        else serviceObservable = this.serviceService.create(this.service);

        serviceObservable.subscribe(
            (service) => {
                if (this.service.id) {
                    this.toastr.success(`Service ${service.name} updated.`);
                    this.eventService.send(new AppEvent(AppEvent.Action.ServiceUpdated, service));
                } else {
                    this.toastr.success(`Service ${service.name} created.`);
                    this.eventService.send(new AppEvent(AppEvent.Action.ServiceCreated, service));
                }
                this.dialogRef.close(this.service);
            },
            (error) => {
                if (
                    error.status === 400 &&
                    error.error?.name === "schema violation" &&
                    error.error?.message
                )
                    this.toastr.error("Error: " + error.error.message);
                else this.toastr.error("Error on persisting service.");
            }
        );
    }

    addTag(event: MatChipInputEvent): void {
        if (event.value) this.service.tags.push(event.value.trim());

        event.input!.value = "";
    }

    removeTag(tag: string): void {
        this.service.tags.splice(this.service.tags.indexOf(tag), 1);
    }
}
