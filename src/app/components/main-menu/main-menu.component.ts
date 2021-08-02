import {AppEvent} from "@app/events/AppEvent";
import {ApplicationConfigService} from "@app/services/application-config.service";
import {Component, OnInit} from "@angular/core";
import {EventService} from "@app/services/event.service";
import {BehaviorSubject, config} from "rxjs";
import {KongConfiguration} from "@app/models/KongConfiguration";
import {MatRadioChange} from "@angular/material/radio";
import {AuthenticationService} from "@app/services/authentication.service";
import {Router} from "@angular/router";

@Component({
    selector: "app-main-menu",
    templateUrl: "./main-menu.component.html",
    styleUrls: ["./main-menu.component.scss"]
})
export class MainMenuComponent implements OnInit {
    selected: BehaviorSubject<KongConfiguration>;
    configService: ApplicationConfigService;
    authService: AuthenticationService;

    constructor(
        authService: AuthenticationService,
        appConfig: ApplicationConfigService,
        private eventService: EventService,
        private router: Router
    ) {
        this.selected = appConfig.selected;
        this.configService = appConfig;
        this.authService = authService;
    }

    ngOnInit(): void {}

    onRefresh(): void {
        this.eventService.send(new AppEvent(AppEvent.Action.Refresh));
    }

    onLogout(): void {
        this.authService.signOut();
        this.router.navigate(["/login"]);
    }

    onKongChange(event: MatRadioChange): void {
        const kong = this.configService.kong.find((k) => event.value === k.name);
        if (kong) {
            this.configService.selected.next(kong);
            this.eventService.send(new AppEvent(AppEvent.Action.Refresh));
        }
    }

    enabled(): boolean {
        return !this.configService.auth.enabled || this.authService.isAuthenticated();
    }
}
