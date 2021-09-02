import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
// import 'rxjs/add/observable/fromPromise';
import { environment } from 'src/environments/environment';
import { from as observableFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TokenInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return observableFrom(this.handleAccess(request, next)).pipe(
      map((event: HttpResponse<any>) => {
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        // log error
        this.handleError(error);
        return throwError(error);
      })
    );
  }

  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    let token = localStorage.getItem('authToken');

    const refreshUrl = environment.apiUrl + 'login/refresh';
    /*
    if (request.url !== refreshUrl) {
      if (token && !this.userService.tokenIsValid(token)) {
        this.userService.refresh();
        token = this.userService.getToken();
      }
    }
    */

    let changedRequest = request;
    // HttpHeader object immutable - copy values
    const headerSettings: { [name: string]: string | string[]; } = {};
    for (const key of request.headers.keys()) {
      headerSettings[key] = request.headers.getAll(key);
    }
    if (token && request.url !== refreshUrl) {
      headerSettings['Authorization'] = 'Bearer ' + token;
    }
    // headerSettings['Content-Type'] = 'application/json';
    if (request.url.includes(environment.apiUrl)) {
      headerSettings['Cache-Control'] = 'no-cache';
      headerSettings['Pragma'] = 'no-cache';
      headerSettings['Expires'] = 'Sat, 01 Jan 2000 00:00:00 GMT';
      headerSettings['If-Modified-Since'] = '0';
    }
    const newHeader = new HttpHeaders(headerSettings);
    changedRequest = request.clone({ headers: newHeader });
    return next.handle(changedRequest).toPromise();
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      console.log('401 error');
    }
    // 403: permission error
    if (error.status === 403) {
      console.log('403 error');
    }
    if (error.status === 500 && error.error.message === 'Invalid refresh token') {
      console.log('500 error');
    }
    if (error.status !== 400) {
      console.log('other non 400 error');
    }
  }

}
