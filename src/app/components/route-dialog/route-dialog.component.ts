import {AppEvent} from "@app/events/AppEvent";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {Component, Inject, OnInit} from "@angular/core";
import {EventService} from "@app/services/event.service";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Observable} from "rxjs";
import {Route} from "@app/models/Route";
import {RouteService} from "@app/services/route.service";
import {Service} from "@app/models/Service";
import {ServiceId} from "@app/models/ServiceId";
import {ServiceService} from "@services/service.service";
import {ServiceDialogComponent} from "../service-dialog/service-dialog.component";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: "app-route-dialog",
    templateUrl: "./route-dialog.component.html",
    styleUrls: ["./route-dialog.component.scss"]
})
export class RouteDialogComponent implements OnInit {
    route: Route;
    services: Array<Service> = [];

    readonly separatorKeysCodes = [ENTER, COMMA] as const;
    readonly truthy: boolean = true;

    constructor(
        private eventService: EventService,
        private routeService: RouteService,
        private serviceService: ServiceService,
        private toastr: ToastrService,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<RouteDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data
    ) {
        this.route = data.route;
    }

    ngOnInit(): void {
        this.serviceService.list().subscribe(
            (services) => {
                this.services = [...services];
                this.services.sort((s1: Service, s2: Service) => {
                    const n1 = s1.name ? s1.name : s1.id;
                    const n2 = s2.name ? s2.name : s2.id;
                    return n1.localeCompare(n2);
                });
            },
            (error) => this.toastr.error("Could not load services.")
        );
    }

    cancel(): void {
        this.dialogRef.close();
    }

    ok(): void {
        let routeObservable: Observable<Route>;
        if (this.route.id) routeObservable = this.routeService.persist(this.route);
        else routeObservable = this.routeService.create(this.route);

        routeObservable.subscribe(
            (route) => {
                if (this.route.id) {
                    this.toastr.success(`Route ${route.name} saved.`);
                    this.eventService.send(new AppEvent(AppEvent.Action.RouteUpdated, route));
                } else {
                    this.toastr.success(`Route ${route.name} created.`);
                    this.eventService.send(new AppEvent(AppEvent.Action.RouteCreated, route));
                }
                this.dialogRef.close(this.route);
            },
            (error) => this.toastr.error("Error on persisting route.")
        );
    }

    addPath(event: MatChipInputEvent): void {
        if (event.value) this.route.paths.push(event.value.trim());

        event.input!.value = "";
    }

    removePath(path: string): void {
        this.route.paths.splice(this.route.paths.indexOf(path), 1);
    }

    addTag(event: MatChipInputEvent): void {
        if (event.value) this.route.tags.push(event.value.trim());

        event.input!.value = "";
    }

    removeTag(tag: string): void {
        this.route.tags.splice(this.route.tags.indexOf(tag), 1);
    }

    addHost(event: MatChipInputEvent): void {
        if (event.value) this.route.hosts.push(event.value.trim());

        event.input!.value = "";
    }

    removeHost(host: string): void {
        this.route.hosts.splice(this.route.hosts.indexOf(host), 1);
    }

    serviceToServiceIdObject(service: Service): ServiceId {
        return {id: service.id};
    }

    compareServiceIds(s1: ServiceId, s2: ServiceId): boolean {
        if (!s1 && !s2) return true;
        if (!s1 || !s2) return false;

        return s1.id === s2.id;
    }

    isValid(): boolean {
        if (this.route.protocols.length === 0) return false;

        let valid = true;

        for (const protocol of this.route.protocols) {
            switch (protocol) {
                case "http":
                    if (
                        this.isEmpty(this.route.methods) &&
                        this.isEmpty(this.route.hosts) &&
                        this.isEmpty(this.route.headers) &&
                        this.isEmpty(this.route.paths)
                    )
                        valid = false;
                    break;
                case "https":
                    if (
                        this.isEmpty(this.route.methods) &&
                        this.isEmpty(this.route.hosts) &&
                        this.isEmpty(this.route.headers) &&
                        this.isEmpty(this.route.paths) &&
                        this.isEmpty(this.route.snis)
                    )
                        valid = false;
                    break;
                case "tcp":
                    if (this.isEmpty(this.route.sources) && this.isEmpty(this.route.destinations))
                        valid = false;
                    break;
                case "tls":
                    if (
                        this.isEmpty(this.route.sources) &&
                        this.isEmpty(this.route.destinations) &&
                        this.isEmpty(this.route.snis)
                    )
                        valid = false;
                    break;
                case "grpc":
                    if (
                        this.isEmpty(this.route.hosts) &&
                        this.isEmpty(this.route.headers) &&
                        this.isEmpty(this.route.paths)
                    )
                        valid = false;
                    break;
                case "grpcs":
                    if (
                        this.isEmpty(this.route.hosts) &&
                        this.isEmpty(this.route.headers) &&
                        this.isEmpty(this.route.paths) &&
                        this.isEmpty(this.route.snis)
                    )
                        valid = false;
                    break;
            }
        }

        return valid;
    }

    onOpenAssignedService(): void {
        this.cancel();

        const options = new MatDialogConfig();
        options.autoFocus = true;
        options.data = {service: this.findService(this.route.service.id)};

        this.dialog.open(ServiceDialogComponent, options);
    }

    private findService(id: string): Service {
        return this.services.find((s) => s.id === id);
    }

    private isEmpty(values: Array<any>): boolean {
        if (!values) return false;
        else return values.length === 0;
    }
}
