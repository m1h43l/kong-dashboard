import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {MatChip, MatChipList, MatChipListChange} from "@angular/material/chips";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {RouteDialogComponent} from "@app/components/route-dialog/route-dialog.component";
import {AppEvent} from "@app/events/AppEvent";
import {Route} from "@app/models/Route";
import {EventService} from "@app/services/event.service";
import {RouteService} from "@app/services/route.service";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: "app-routes-page",
    templateUrl: "./routes-page.component.html",
    styleUrls: ["./routes-page.component.scss"]
})
export class RoutesPageComponent implements OnInit, OnDestroy {
    @ViewChild("searchField") searchField: ElementRef;
    @ViewChild(MatChipList) tagsFilterList: MatChipList;

    routes: Array<Route> = [];
    filterTerm = "";
    filterTags: Array<string> = [];
    tags: Array<string> = [];

    private eventSubscription: any;

    constructor(
        private routeService: RouteService,
        private eventService: EventService,
        private toastr: ToastrService,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.eventSubscription = this.eventService.subscribe((event: AppEvent) => {
            switch (event.action) {
                case AppEvent.Action.Refresh:
                    this.loadRoutes();
                    break;

                case AppEvent.Action.RouteDeleted:
                    this.routes.splice(this.routes.indexOf(event.payload), 1);
                    this.routes = [...this.routes];
                    this.retrieveTags();
                    break;

                case AppEvent.Action.RouteCreated:
                    this.routes.push(event.payload);
                    this.routes = [...this.routes];
                    this.sortRoutes();
                    this.retrieveTags();
                    break;

                case AppEvent.Action.RouteUpdated:
                    const x = this.routes.findIndex((r) => r.id === event.payload.id);
                    if (x >= 0) this.routes.splice(x, 1, event.payload);
                    this.routes = [...this.routes];
                    this.retrieveTags();
                    break;
            }
        });

        this.loadRoutes();
    }

    ngOnDestroy(): void {
        if (this.eventSubscription) this.eventSubscription.unsubscribe();
    }

    private loadRoutes(): void {
        this.routeService.list().subscribe(
            (routes: Array<Route>) => {
                this.routes = [...routes];
                this.sortRoutes();
                this.retrieveTags();
            },
            (error) => this.toastr.error("Could not load list of routes.")
        );
    }

    private sortRoutes(): void {
        this.routes.sort((r1: Route, r2: Route) => {
            const n1 = r1.name ? r1.name : r1.id;
            const n2 = r2.name ? r2.name : r2.id;

            return n1.localeCompare(n2);
        });
    }

    private retrieveTags(): void {
        const tags: Set<string> = new Set();

        this.routes.forEach((r) => {
            if (r.tags) r.tags.forEach((t) => tags.add(t));
        });

        this.tags = Array.from(tags);
        this.tags.sort();
    }

    onAddRoute(): void {
        const route: Route = this.newRoute();
        const options = new MatDialogConfig();
        options.disableClose = false;
        options.autoFocus = true;
        options.data = {route};

        this.dialog.open(RouteDialogComponent, options);
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

    newRoute(): Route {
        const route: Route = {
            protocols: ["http", "https"],
            methods: [],
            hosts: [],
            paths: [],
            sources: [],
            destinations: [],
            headers: [],
            snis: [],
            strip_path: true,
            regex_priority: 0,
            https_redirect_status_code: 426,
            preserve_host: true,
            request_buffering: true,
            response_buffering: true,
            tags: []
        };
        return route;
    }
}
