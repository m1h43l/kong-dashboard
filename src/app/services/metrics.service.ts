import {ApplicationConfigService} from "./application-config.service";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";
import {Metrics} from "@app/models/Metrics";

@Injectable({
    providedIn: "root"
})
export class MetricsService {
    constructor(private http: HttpClient, private appConfig: ApplicationConfigService) {}

    get(): Observable<Metrics> {
        const url = this.appConfig.selected.value.url + "/metrics";
        return this.http
            .get(url, {headers: {Accept: "text/plain"}, responseType: "text"})
            .pipe(map((data: string) => this.parseMetrics(data)));
    }

    private parseMetrics(data: string): Metrics {
        // Metric lines look like this:
        // # TYPE kong_nginx_http_current_connections gauge
        // kong_nginx_http_current_connections{state="accepted"} 589
        const metrics: any = {connections: {}};
        const lines = data.split("\n");
        for (const line of lines) {
            if (line.startsWith("#")) continue;

            const parts = line.split(/[\{\} ]/);
            if (parts.length === 0) continue;

            switch (parts[0]) {
                case "kong_nginx_metric_errors_total":
                    metrics.errors = +parts[1];
                    break;

                case "kong_nginx_http_current_connections":
                    const state: string = this.parseState(parts[1]);
                    if (state) metrics.connections[state] = +parts[3];
                    break;
            }
        }

        return metrics as Metrics;
    }

    private parseState(linePart: string): string {
        // state part looks like this: state="accepted"
        const parts = linePart.split("=");
        if (parts.length >= 2) return parts[1].split('"').filter(Boolean).join('"');
        else return undefined;
    }
}
