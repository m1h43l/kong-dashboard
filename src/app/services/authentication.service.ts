import {ApplicationConfigService} from "./application-config.service";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {JwtHelperService} from "@auth0/angular-jwt";
import {Observable, BehaviorSubject} from "rxjs";

const USERNAME = "username";
const AUTH_TOKEN = "authToken";
const AUTH_TOKEN_PAYLOAD = "authTokenPayload";

@Injectable({
    providedIn: "root"
})
export class AuthenticationService {
    username: string = "not logged in";
    currentTokenData = new BehaviorSubject(this.getTokenData());

    constructor(private appConfig: ApplicationConfigService, private http: HttpClient) {
        this.currentTokenData.next(this.getTokenData());
        this.username = localStorage.getItem(USERNAME);
    }

    isAuthenticated(): boolean {
        return localStorage.getItem(AUTH_TOKEN) !== null;
    }

    authenticate(username: string, password: string): Observable<boolean> {
        return new Observable((observer) => {
            const url = this.appConfig.auth.url;
            const body = new HttpParams()
                .set("client_id", username)
                .set("client_secret", password)
                .set("grant_type", "client_credentials");
            this.http.post(url, body, {observe: "response"}).subscribe(
                (response) => {
                    if (response.status === 401) observer.next(false);
                    else if (!response.body || !response.body["access_token"])
                        observer.error("Invalid response from authentication service.");
                    else {
                        const jwt = new JwtHelperService();
                        const token = response.body["access_token"].toString();
                        const payload = jwt.decodeToken(token);
                        if (!payload) observer.error("Returned auth token is invalid.");
                        else {
                            localStorage.setItem(AUTH_TOKEN_PAYLOAD, JSON.stringify(payload));
                            localStorage.setItem(AUTH_TOKEN, token);
                            localStorage.setItem(USERNAME, username);
                            observer.next(response.status === 200);
                            this.currentTokenData.next(payload);
                            this.username = username;
                        }
                    }
                    observer.complete();
                },
                (error) => {
                    if (error.status && error.status === 401) observer.next(false);
                    else observer.error(error);
                }
            );
        });
    }

    getToken(): any {
        if (localStorage.getItem(AUTH_TOKEN) !== null) return localStorage.getItem(AUTH_TOKEN);
    }

    getTokenData(): any {
        if (localStorage.getItem(AUTH_TOKEN_PAYLOAD) !== null)
            return JSON.parse(localStorage.getItem(AUTH_TOKEN_PAYLOAD));
    }

    isTokenExpired(): boolean {
        const token = this.getToken();
        if (!token) return true;

        try {
            const jwt = new JwtHelperService();
            return jwt.isTokenExpired(token);
        } catch (error) {
            return true;
        }
    }

    signOut(): void {
        localStorage.removeItem(AUTH_TOKEN);
        localStorage.removeItem(AUTH_TOKEN_PAYLOAD);
        localStorage.removeItem(USERNAME);
        this.currentTokenData.next(undefined);
        this.username = "not logged in";
    }
}
