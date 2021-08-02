import {ElementRef, OnDestroy} from "@angular/core";
import {Component, OnInit, ViewChild} from "@angular/core";
import {MatChip, MatChipList, MatChipListChange} from "@angular/material/chips";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ServiceDialogComponent} from "@app/components/service-dialog/service-dialog.component";
import {AppEvent} from "@app/events/AppEvent";
import {Service} from "@app/models/Service";
import {EventService} from "@app/services/event.service";
import {ServiceService} from "@services/service.service";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: "app-services-page",
    templateUrl: "./services-page.component.html",
    styleUrls: ["./services-page.component.scss"]
})
export class ServicesPageComponent implements OnInit, OnDestroy {
    @ViewChild("searchField") searchField: ElementRef;
    @ViewChild(MatChipList) tagsFilterList: MatChipList;

    filterTerm = "";
    filterTags: Array<string> = [];
    services: Array<Service> = [];
    tags: Array<string> = [];

    private eventSubscription: any;

    constructor(
        private serviceService: ServiceService,
        private eventService: EventService,
        private toastr: ToastrService,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.eventSubscription = this.eventService.subscribe((event: AppEvent) => {
            switch (event.action) {
                case AppEvent.Action.Refresh:
                    this.loadServices();
                    break;

                case AppEvent.Action.ServiceDeleted:
                    this.services.splice(this.services.indexOf(event.payload), 1);
                    this.services = [...this.services];
                    this.retrieveTags();
                    break;

                case AppEvent.Action.ServiceCreated:
                    this.services.push(event.payload);
                    this.services = [...this.services];
                    this.sortServices();
                    this.retrieveTags();
                    break;

                case AppEvent.Action.ServiceUpdated:
                    const x = this.services.findIndex((s) => s.id === event.payload.id);
                    if (x >= 0) this.services.splice(x, 1, event.payload);
                    this.services = [...this.services];
                    this.retrieveTags();
                    break;
            }
        });

        this.loadServices();
    }

    ngOnDestroy(): void {
        if (this.eventSubscription) this.eventSubscription.unsubscribe();
    }

    private loadServices(): void {
        this.serviceService.list().subscribe(
            (services: Array<Service>) => {
                this.services = [...services];
                this.sortServices();
                this.retrieveTags();
            },
            (error) => this.toastr.error("Could not load list of services.")
        );
    }

    private sortServices(): void {
        this.services.sort((s1: Service, s2: Service) => s1.name.localeCompare(s2.name));
    }

    private retrieveTags(): void {
        const tags: Set<string> = new Set();

        this.services.forEach((s) => {
            if (s.tags) s.tags.forEach((t) => tags.add(t));
        });

        this.tags = Array.from(tags);
        this.tags.sort();
    }

    onAddService(): void {
        const service: Service = {name: "", protocol: "http", host: "", port: 80};
        const options = new MatDialogConfig();
        options.disableClose = true;
        options.autoFocus = true;
        options.data = {service};

        this.dialog.open(ServiceDialogComponent, options);
    }

    onClearFilter(): void {
        this.filterTerm = "";
        this.filterTags = [];

        if (this.tagsFilterList?.selected) {
            if (this.tagsFilterList.selected instanceof MatChip)
                (this.tagsFilterList.selected as MatChip).toggleSelected();
            else
                this.tagsFilterList.selected.forEach((chip) => {
                    if (chip.selected) chip.toggleSelected();
                });
        }
    }

    onTagFilterChange(event: MatChipListChange): void {
        if (event.value && event.value.length > 0) this.filterTags = event.value;
        else this.filterTags = [];
    }
}
