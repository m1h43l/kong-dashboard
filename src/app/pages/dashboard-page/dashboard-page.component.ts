import {Component, OnDestroy, OnInit} from "@angular/core";
import {AppEvent} from "@app/events/AppEvent";
import {Metrics} from "@app/models/Metrics";
import {ServerInfo} from "@app/models/ServerInfo";
import {EventService} from "@app/services/event.service";
import {MetricsService} from "@app/services/metrics.service";
import {ServerInfoService} from "@app/services/server-info.service";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: "app-dashboard-page",
    templateUrl: "./dashboard-page.component.html",
    styleUrls: ["./dashboard-page.component.scss"]
})
export class DashboardPageComponent implements OnInit, OnDestroy {
    serverInfo: ServerInfo;
    metrics: Metrics;
    eventSubscription: any;

    constructor(
        private eventService: EventService,
        private metricsService: MetricsService,
        private serverInfoService: ServerInfoService,
        private toastr: ToastrService
    ) {}

    ngOnInit(): void {
        this.eventService.subscribe((event: AppEvent) => {
            if (event.action === AppEvent.Action.Refresh) this.loadData();
        });

        this.loadData();
    }

    ngOnDestroy(): void {
        if (this.eventSubscription) this.eventSubscription.unsubscribe();
    }

    loadData() {
        this.metricsService.get().subscribe(
            (metrics) => (this.metrics = metrics),
            (error) => this.toastr.error("Could not get Kong metrics.")
        );

        this.serverInfoService.get().subscribe(
            (serverInfo) => (this.serverInfo = serverInfo),
            (error) => this.toastr.error("Could not load sever info.")
        );
    }
}
