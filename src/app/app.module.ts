import * as echarts from "echarts";
import {APP_INITIALIZER, NgModule} from "@angular/core";
import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {ApplicationConfigService} from "@services/application-config.service";
import {AssignedRoutesDialogComponent} from "./components/assigned-routes-dialog/assigned-routes-dialog.component";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {DashboardPageComponent} from "./pages/dashboard-page/dashboard-page.component";
import {ExpiredInterceptorService} from "./services/expired-interceptor.service";
import {FlexLayoutModule} from "@angular/flex-layout";
import {FormsModule} from "@angular/forms";
import {HttpAuthTokenInterceptorService} from "./services/http-auth-token-interceptor.service";
import {HttpProgressUiComponent} from "@components/http-progress-ui/http-progress-ui.component";
import {HttpClientModule, HTTP_INTERCEPTORS} from "@angular/common/http";
import {HttpLoaderService} from "@services/http-loader.service";
import {HttpLoaderInterceptorService} from "@services/http-loader-interceptor.service";
import {LoginPageComponent} from "./pages/login-page/login-page.component";
import {MainMenuComponent} from "@components/main-menu/main-menu.component";
import {NgxEchartsModule} from "ngx-echarts";
import {RouteCardComponent} from "./components/route-card/route-card.component";
import {RouteDialogComponent} from "./components/route-dialog/route-dialog.component";
import {RouteFilterPipe} from "./pipes/route-filter.pipe";
import {RoutesPageComponent} from "@pages/routes-page/routes-page.component";
import {ServiceCardComponent} from "@components/service-card/service-card.component";
import {ServiceDialogComponent} from "@components/service-dialog/service-dialog.component";
import {ServiceFilterPipe} from "@pipes/service-filter.pipe";
import {ServicesPageComponent} from "@pages/services-page/services-page.component";
import {SharedModule} from "./modules/shared/shared.module";
import {ToastrModule} from "ngx-toastr";
import {ConsumersPageComponent} from "./pages/consumers-page/consumers-page.component";
import {ConsumerFilterPipe} from "./pipes/consumer-filter.pipe";
import {ConsumerCardComponent} from "./components/consumer-card/consumer-card.component";
import { ConsumerDialogComponent } from './components/consumer-dialog/consumer-dialog.component';

export function appInit(appConfig: ApplicationConfigService) {
    return () => appConfig.load();
}
@NgModule({
    declarations: [
        AppComponent,
        AssignedRoutesDialogComponent,
        DashboardPageComponent,
        HttpProgressUiComponent,
        LoginPageComponent,
        MainMenuComponent,
        RouteCardComponent,
        RouteDialogComponent,
        RouteFilterPipe,
        RoutesPageComponent,
        ServicesPageComponent,
        ServiceFilterPipe,
        ServiceDialogComponent,
        ServiceCardComponent,
        ConsumersPageComponent,
        ConsumerFilterPipe,
        ConsumerCardComponent,
        ConsumerDialogComponent
    ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        FormsModule,
        HttpClientModule,
        NgxEchartsModule.forRoot({
            echarts
        }),
        SharedModule,
        ToastrModule.forRoot()
    ],
    providers: [
        HttpLoaderService,
        {provide: HTTP_INTERCEPTORS, useClass: HttpLoaderInterceptorService, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: HttpAuthTokenInterceptorService, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ExpiredInterceptorService, multi: true},
        ApplicationConfigService,
        {
            provide: APP_INITIALIZER,
            useFactory: appInit,
            multi: true,
            deps: [ApplicationConfigService]
        },
        {provide: Window, useValue: window}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
