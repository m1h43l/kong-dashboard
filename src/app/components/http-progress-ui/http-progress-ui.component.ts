import {Component, OnInit} from "@angular/core";
import {HttpLoaderService} from "@services/http-loader.service";

@Component({
    selector: "app-http-progress-ui",
    templateUrl: "./http-progress-ui.component.html",
    styleUrls: ["./http-progress-ui.component.scss"]
})
export class HttpProgressUiComponent implements OnInit {
    visible: boolean = false;

    constructor(private loaderService: HttpLoaderService) {
        this.loaderService.isLoading.subscribe((value: boolean) => {
            this.visible = value;
        });
    }

    ngOnInit(): void {}
}
