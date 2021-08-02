import {AuthenticationService} from "@app/services/authentication.service";
import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";

@Component({
    selector: "app-login-page",
    templateUrl: "./login-page.component.html",
    styleUrls: ["./login-page.component.scss"]
})
export class LoginPageComponent implements OnInit {
    username: string;
    password: string;
    errorMessage: string;

    constructor(private authService: AuthenticationService, private router: Router) {}

    ngOnInit(): void {}

    ok(): void {
        this.authService.authenticate(this.username, this.password).subscribe(
            (result) => {
                this.errorMessage = result ? "" : "Invalid username or password";
                if (result) this.router.navigate(["/"]);
                else setTimeout(() => (this.errorMessage = ""), 3000);
            },
            (error) => {
                this.errorMessage = "Could not authenticate.";
                setTimeout(() => (this.errorMessage = ""), 3000);
            }
        );
    }
}
