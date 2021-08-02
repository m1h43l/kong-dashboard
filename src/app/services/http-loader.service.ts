import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";

@Injectable({
    providedIn: "root"
})
export class HttpLoaderService {
    public isLoading = new BehaviorSubject<boolean>(false);
    constructor() {}
}
