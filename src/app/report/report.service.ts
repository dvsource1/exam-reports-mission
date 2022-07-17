import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, map, Observable, shareReplay } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Activity } from '../core/model/api/activity';
import { Class } from '../core/model/api/class';
import { CombinedReports } from '../core/model/ui/report';

/**
 * Responsible for handling reports related API requests
 * And caching response as an `Observable`
 * @author <virajkaush@gmail.com>
 * @since  2022.07.17
 */
@Injectable({
  providedIn: 'root',
})
export class ReportService {
  /**
   * combined reports cache as an `Observable`
   */
  private reportCache$: Observable<CombinedReports> | null = null;

  constructor(private http: HttpClient) {}

  /**
   * return cached reports
   * @returns {Observable<CombinedReports>}
   */
  get reports$(): Observable<CombinedReports> {
    if (!this.reportCache$) {
      this.reportCache$ = combineLatest({
        classes: this.getClasses(),
        activities: this.getActivities(),
      }).pipe(shareReplay(1));
    }

    return this.reportCache$;
  }

  /**
   * send classes GET request
   * @returns {Observable<Class[]>} classes
   */
  private getClasses(): Observable<Class[]> {
    return this.http.get<Class[]>(environment.api.classes).pipe();
  }

  /**
   * send activities GET request
   * @returns {Observable<Activity[]>} activities
   */
  private getActivities(): Observable<Activity[]> {
    return this.http
      .get<{ body: string }>(environment.api.activities)
      .pipe(map((res) => JSON.parse(res.body)));
  }
}
