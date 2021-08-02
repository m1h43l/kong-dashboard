import {AuthenticationService} from "./authentication.service";
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {ApplicationConfigService} from "./application-config.service";

@Injectable({
    providedIn: "root"
})
export class ExpiredInterceptorService implements HttpInterceptor {
    constructor(
        private appConfig: ApplicationConfigService,
        private authService: AuthenticationService,
        private router: Router,
        private toastr: ToastrService
    ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.appConfig.auth?.enabled) {
            if (this.authService.isTokenExpired()) {
                if (this.authService.getToken())
                    this.toastr.info("Your login expired.\nPlease login again.");
                this.authService.signOut();
                this.router.navigate(["/login"]);
            }
        }

        return next.handle(request);
    }
}
