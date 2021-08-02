import {Injectable} from "@angular/core";
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent} from "@angular/common/http";
import {Observable} from "rxjs";
import {AuthenticationService} from "./authentication.service";
import {ApplicationConfigService} from "./application-config.service";

@Injectable({
    providedIn: "root"
})
export class HttpAuthTokenInterceptorService implements HttpInterceptor {
    constructor(
        private appConfig: ApplicationConfigService,
        private authService: AuthenticationService
    ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.appConfig.auth?.enabled && this.authService.isAuthenticated()) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${this.authService.getToken()}`
                }
            });
        }

        return next.handle(request);
    }
}
