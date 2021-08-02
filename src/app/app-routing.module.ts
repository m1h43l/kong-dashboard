import {AuthGuard} from "./auth.guard";
import {ConsumersPageComponent} from "@pages/consumers-page/consumers-page.component";
import {DashboardPageComponent} from "@pages/dashboard-page/dashboard-page.component";
import {LoginPageComponent} from "./pages/login-page/login-page.component";
import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {RoutesPageComponent} from "@pages/routes-page/routes-page.component";
import {ServicesPageComponent} from "@pages/services-page/services-page.component";

const routes: Routes = [
    {path: "overview", component: DashboardPageComponent, canActivate: [AuthGuard]},
    {path: "login", component: LoginPageComponent},
    {path: "services", component: ServicesPageComponent, canActivate: [AuthGuard]},
    {path: "routes", component: RoutesPageComponent, canActivate: [AuthGuard]},
    {path: "consumers", component: ConsumersPageComponent, canActivate: [AuthGuard]},
    {path: "**", component: DashboardPageComponent, canActivate: [AuthGuard]}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
