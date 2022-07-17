import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, map, Observable, shareReplay } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Activity } from '../core/model/activity';
import { Class } from '../core/model/class';
import { CombinedReports } from '../core/model/report';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private reportCache$: Observable<CombinedReports> | null = null;

  constructor(private http: HttpClient) {}

  get reports$(): Observable<CombinedReports> {
    if (!this.reportCache$) {
      this.reportCache$ = combineLatest({
        classes: this.getClasses(),
        activities: this.getActivities(),
      }).pipe(shareReplay(1));
    }

    return this.reportCache$;
  }

  private getClasses(): Observable<Class[]> {
    return this.http.get<Class[]>(environment.api.classes).pipe();
  }

  private getActivities(): Observable<Activity[]> {
    return this.http
      .get<{ body: string }>(environment.api.activities)
      .pipe(map((res) => JSON.parse(res.body)));
  }
}
