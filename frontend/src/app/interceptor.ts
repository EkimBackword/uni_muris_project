import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
    constructor(private router: Router, private zone: NgZone) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = request.clone({ withCredentials: true });
        return next.handle(request).do(
            (event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    // console.log('GOOD HttpResponse');
                }
            },
            (err: any) => {
                if (err instanceof HttpErrorResponse) {
                    if (err.status === 401) {
                        this.zone.run(() => {
                            this.router.navigate(['/login']);
                        });
                    }
                    // console.log('This is HttpErrorResponse');
                }
            }
        );
    }
}
