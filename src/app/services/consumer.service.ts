import {ApplicationConfigService} from "./application-config.service";
import {Consumer} from "@app/models/Consumer";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";

@Injectable({
    providedIn: "root"
})
export class ConsumerService {
    private httpOptions = {
        headers: new HttpHeaders({
            Accept: "application/json"
        })
    };

    constructor(private http: HttpClient, private appConfig: ApplicationConfigService) {}

    list(): Observable<Array<Consumer>> {
        const url = this.appConfig.selected.value.url + "/consumers";
        return this.http.get<KongResponse>(url, this.httpOptions).pipe(map((data) => data.data));
    }

    create(consumer: Consumer): Observable<Consumer> {
        const url = this.appConfig.selected.value.url + "/consumers";
        consumer = this.sanitizeConsumerModel(consumer);

        const httpOptions = {
            headers: new HttpHeaders({
                Accept: "application/json",
                "Content-Type": "application/json"
            })
        };
        return this.http.post<Consumer>(url, consumer, httpOptions);
    }

    persist(consumer: Consumer): Observable<Consumer> {
        const url = this.appConfig.selected.value.url + "/consumers/" + consumer.id;
        consumer = this.sanitizeConsumerModel(consumer);

        const httpOptions = {
            headers: new HttpHeaders({
                Accept: "application/json",
                "Content-Type": "application/json"
            })
        };
        return this.http.put<Consumer>(url, consumer, httpOptions);
    }

    delete(consumer: Consumer): Observable<HttpResponse<Object>> {
        const url = this.appConfig.selected.value.url + "/consumers/" + consumer.id;
        return this.http.delete(url, {observe: "response"});
    }

    sanitizeConsumerModel(consumer: Consumer): Consumer {
        if (consumer.custom_id !== undefined && consumer.custom_id.length === 0)
            delete consumer.custom_id;
        if (consumer.username !== undefined && consumer.username.length === 0)
            delete consumer.username;
        if (consumer.tags && this.isEmpty(consumer.tags)) delete consumer.tags;

        return consumer;
    }

    private isEmpty(values: Array<any>): boolean {
        if (!values) return false;
        else return values.length === 0;
    }
}

interface KongResponse {
    data: Array<Consumer>;
    next: string;
}
