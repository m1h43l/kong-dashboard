import {Injectable} from "@angular/core";
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree
} from "@angular/router";
import {Observable} from "rxjs";
import {AuthenticationService} from "@app/services/authentication.service";
import {ApplicationConfigService} from "@app/services/application-config.service";

@Injectable({
    providedIn: "root"
})
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthenticationService,
        private configService: ApplicationConfigService
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (this.configService.auth.enabled)
            return this.authService.isAuthenticated() ? true : this.router.parseUrl("/login");
        else return true;
    }
}
