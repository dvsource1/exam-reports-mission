import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Activity } from '../core/model/activity';
import { Class } from '../core/model/class';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private http: HttpClient) {}

  getClasses(): Observable<Class[]> {
    return this.http
      .get<Class[]>(environment.api.classes)
      .pipe(tap(console.log));
  }

  getActivities(): Observable<Activity[]> {
    return this.http.get<{ body: string }>(environment.api.activities).pipe(
      map((res) => JSON.parse(res.body)),
      tap(console.log)
    );
  }
}
