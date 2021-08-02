import {Component, Inject, OnInit} from "@angular/core";
import {MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Route} from "@app/models/Route";
import {RouteService} from "@app/services/route.service";
import {Service} from "@app/models/Service";
import {ServiceDialogComponent} from "../service-dialog/service-dialog.component";
import {ToastrService} from "ngx-toastr";
import {RouteDialogComponent} from "../route-dialog/route-dialog.component";

@Component({
    selector: "app-assigned-routes-dialog",
    templateUrl: "./assigned-routes-dialog.component.html",
    styleUrls: ["./assigned-routes-dialog.component.scss"]
})
export class AssignedRoutesDialogComponent implements OnInit {
    echartsInstance: any;
    routes: Array<Route> = [];
    service: Service;
    chartOptions = {
        title: {text: "Assigned Routes", show: true, textStyle: {color: "white"}},
        series: [
            {
                type: "tree",
                data: [],
                left: "200px",
                right: "200px",
                orient: "LR",
                label: {
                    position: "left",
                    verticalAlign: "middle",
                    align: "right",
                    color: "white"
                },
                leaves: {
                    label: {
                        position: "right",
                        verticalAlign: "middle",
                        align: "left",
                        color: "white"
                    },
                    itemStyle: {borderCap: "square", color: "green"}
                },
                expandAndCollapse: false
            }
        ],
        textStyle: {color: "white"}
    };

    constructor(
        private toastr: ToastrService,
        private routeService: RouteService,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<AssignedRoutesDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data
    ) {
        this.service = data.service;
    }

    ngOnInit(): void {
        this.routeService.list(this.service.id).subscribe(
            (routes) => {
                this.chartOptions.title.text = "Assigned routes for " + this.service.name;
                const chartData = {
                    name: this.service.name,
                    children: []
                };
                for (const route of routes) {
                    chartData.children.push({name: route.name ? route.name : route.id});
                }
                this.chartOptions.series[0].data.push(chartData);
                this.routes.push(...routes);
            },
            (error) => this.toastr.error("Could not load routes for service " + this.service.name)
        );
    }

    onChartInit(instance): void {
        this.echartsInstance = instance;
    }

    onChartClick(event: any): void {
        if (this.routes.length === 0) this.showService();
        else if (event.data.children) this.showService();
        else this.showRoute(event.data.name);
    }

    private showRoute(idOrName: string): void {
        const route = this.findRoute(idOrName);
        if (route) {
            this.dialogRef.close();

            const options = new MatDialogConfig();
            options.disableClose = false;
            options.autoFocus = true;
            options.data = {route};

            this.dialog.open(RouteDialogComponent, options);
        }
    }

    private findRoute(idOrName: string): Route {
        for (const r of this.routes) {
            if (idOrName === r.name || idOrName === r.id) return r;
        }

        return undefined;
    }

    private showService(): void {
        this.dialogRef.close();

        const options = new MatDialogConfig();
        options.disableClose = false;
        options.autoFocus = true;
        options.data = {service: this.service};

        this.dialog.open(ServiceDialogComponent, options);
    }
}
