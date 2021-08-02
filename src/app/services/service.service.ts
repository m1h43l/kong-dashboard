import {ApplicationConfigService} from "./application-config.service";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";
import {Service} from "@app/models/Service";

@Injectable({
    providedIn: "root"
})
export class ServiceService {
    private httpOptions = {
        headers: new HttpHeaders({
            Accept: "application/json"
        })
    };

    constructor(private http: HttpClient, private appConfig: ApplicationConfigService) {}

    list(): Observable<Array<Service>> {
        const url = this.appConfig.selected.value.url + "/services";
        return this.http.get<KongResponse>(url, this.httpOptions).pipe(map((data) => data.data));
    }

    create(service: Service): Observable<Service> {
        const url = this.appConfig.selected.value.url + "/services";
        const httpOptions = {
            headers: new HttpHeaders({
                Accept: "application/json",
                "Content-Type": "application/json"
            })
        };
        return this.http.post<Service>(url, service, httpOptions);
    }

    persist(service: Service): Observable<Service> {
        const url = this.appConfig.selected.value.url + "/services/" + service.id;
        const httpOptions = {
            headers: new HttpHeaders({
                Accept: "application/json",
                "Content-Type": "application/json"
            })
        };
        return this.http.put<Service>(url, service, httpOptions);
    }

    delete(service: Service): Observable<HttpResponse<Object>> {
        const url = this.appConfig.selected.value.url + "/services/" + service.id;
        return this.http.delete(url, {observe: "response"});
    }
}

interface KongResponse {
    data: Array<Service>;
    next: string;
}
