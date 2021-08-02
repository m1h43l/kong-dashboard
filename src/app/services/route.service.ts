import {ApplicationConfigService} from "./application-config.service";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";
import {Route} from "@app/models/Route";

@Injectable({
    providedIn: "root"
})
export class RouteService {
    private httpOptions = {
        headers: new HttpHeaders({
            Accept: "application/json"
        })
    };

    constructor(private http: HttpClient, private appConfig: ApplicationConfigService) {}

    list(serviceId?: string): Observable<Array<Route>> {
        const url = serviceId
            ? this.appConfig.selected.value.url + "/services/" + serviceId + "/routes"
            : this.appConfig.selected.value.url + "/routes";
        return this.http.get<KongResponse>(url, this.httpOptions).pipe(map((data) => data.data));
    }

    create(route: Route): Observable<Route> {
        const url = this.appConfig.selected.value.url + "/routes";
        route = this.sanitizeRouteModel(route);

        const httpOptions = {
            headers: new HttpHeaders({
                Accept: "application/json",
                "Content-Type": "application/json"
            })
        };
        return this.http.post<Route>(url, route, httpOptions);
    }

    persist(route: Route): Observable<Route> {
        const url = this.appConfig.selected.value.url + "/routes";
        route = this.sanitizeRouteModel(route);

        const httpOptions = {
            headers: new HttpHeaders({
                Accept: "application/json",
                "Content-Type": "application/json"
            })
        };
        return this.http.put<Route>(url + "/" + route.id, route, httpOptions);
    }

    delete(route: Route): Observable<HttpResponse<Object>> {
        const url = this.appConfig.selected.value.url + "/routes/" + route.id;
        return this.http.delete(url, {observe: "response"});
    }

    sanitizeRouteModel(route: Route): Route {
        if (route.methods && this.isEmpty(route.methods)) delete route.methods;
        if (route.hosts && this.isEmpty(route.hosts)) delete route.hosts;
        if (route.paths && this.isEmpty(route.paths)) delete route.paths;
        if (route.sources && this.isEmpty(route.sources)) delete route.sources;
        if (route.destinations && this.isEmpty(route.destinations)) delete route.destinations;
        if (route.snis && this.isEmpty(route.snis)) delete route.snis;
        if (route.tags && this.isEmpty(route.tags)) delete route.tags;
        if (route.headers && this.isEmpty(route.headers)) delete route.headers;

        // not in version 2.0.4
        delete route.request_buffering;
        delete route.response_buffering;

        return route;
    }

    private isEmpty(values: Array<any>): boolean {
        if (!values) return false;
        else return values.length === 0;
    }
}

interface KongResponse {
    data: Array<Route>;
    next: string;
}
