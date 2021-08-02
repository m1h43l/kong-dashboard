import {ApplicationConfigService} from "./application-config.service";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";
import {ServerInfo} from "@app/models/ServerInfo";

@Injectable({
    providedIn: "root"
})
export class ServerInfoService {
    private httpOptions = {
        headers: new HttpHeaders({
            Accept: "application/json"
        })
    };

    constructor(private http: HttpClient, private appConfig: ApplicationConfigService) {}

    get(): Observable<ServerInfo> {
        const url = this.appConfig.selected.value.url;
        return this.http.get<any>(url, this.httpOptions).pipe(
            map((data) => {
                const serverInfo: any = {};
                serverInfo.hostname = data.hostname;
                serverInfo.tagline = data.tagline;
                serverInfo.location = data.configuration.prefix;
                serverInfo.dns = [];
                serverInfo.hostsFile = "";
                serverInfo.nginxConfigFile = "";
                serverInfo.nginxErrorLog = "";
                serverInfo.configFile = data.configuration.nginx_kong_conf;
                serverInfo.version = data.version;
                serverInfo.database = {};
                serverInfo.database.dbms = data.configuration.database;
                if (data.configuration.database === "postgres") {
                    serverInfo.database.host = data.configuration.pg_host;
                    serverInfo.database.port = data.configuration.pg_port;
                    serverInfo.database.name = data.configuration.pg_database;
                } else {
                    serverInfo.database.host = data.configuration.cassandra_contact_points;
                    serverInfo.database.port = data.configuration.cassandra_port;
                    serverInfo.database.name = data.configuration.cassandra_keyspace;
                }
                serverInfo.plugins = [];
                Object.keys(data.plugins.available_on_server).forEach((key) =>
                    serverInfo.plugins.push(key)
                );
                serverInfo.plugins.sort();
                return serverInfo as ServerInfo;
            })
        );
    }
}
