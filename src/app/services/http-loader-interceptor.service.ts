import {Injectable} from "@angular/core";
import {
    HttpResponse,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from "@angular/common/http";
import {Observable} from "rxjs";
import {HttpLoaderService} from "@services/http-loader.service";

@Injectable({
    providedIn: "root"
})
export class HttpLoaderInterceptorService implements HttpInterceptor {
    private requests: HttpRequest<any>[] = [];

    constructor(private loaderService: HttpLoaderService) {}

    removeRequest(req: HttpRequest<any>) {
        const i = this.requests.indexOf(req);
        if (i >= 0) {
            this.requests.splice(i, 1);
        }
        this.loaderService.isLoading.next(this.requests.length > 0);
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.requests.push(request);

        this.loaderService.isLoading.next(true);

        return new Observable((observer) => {
            const subscription = next.handle(request).subscribe(
                (event) => {
                    if (event instanceof HttpResponse) {
                        this.removeRequest(request);
                        observer.next(event);
                    }
                },
                (err) => {
                    this.removeRequest(request);
                    observer.error(err);
                    subscription.unsubscribe();
                },
                () => {
                    this.removeRequest(request);
                    observer.complete();
                    subscription.unsubscribe();
                }
            );
        });
    }
}
