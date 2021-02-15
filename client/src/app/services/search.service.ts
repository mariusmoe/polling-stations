import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { throwError } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private http: HttpClient) {}

  private data = new BehaviorSubject<any>([{}]);

  getData() {
    return this.data;
  }

  search(searchParam: any): void {
    this.http
      .post<any>('http://localhost:4000/api/search', searchParam, httpOptions)
      .subscribe(
        (data) => {
          console.log(data);
          this.data.next(Object.assign([], data));
        },
        (error) => this.handleError(error)
      );
  }

  /**
   * From the angular documentation
   *
   * Try to make sense of the error
   * @param error the error thrown
   */
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // Return an observable with a user-facing error message.
    return throwError('Something bad happened; please try again later.');
  }
}
