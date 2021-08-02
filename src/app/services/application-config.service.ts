import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {KongConfiguration} from "@app/models/KongConfiguration";
import {BehaviorSubject} from "rxjs";
import {AuthConfig} from "@app/models/AuthConfig";

@Injectable({
    providedIn: "root"
})
export class ApplicationConfigService {
    auth: AuthConfig;
    kong: Array<KongConfiguration> = [];
    help: string = "";
    selected = new BehaviorSubject<KongConfiguration>(undefined);

    constructor(private http: HttpClient) {}

    load(): Promise<any> {
        const promise = this.http
            .get("assets/config.json")
            .toPromise()
            .then((data) => {
                Object.assign(this, data);
                const selectedConfig = this.kong.find((c) => c.default);
                if (selectedConfig) this.selected.next(selectedConfig);
                else if (this.kong.length > 0) this.selected.next(this.kong[0]);
                return data;
            });

        return promise;
    }
}
