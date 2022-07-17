import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { map, Observable } from 'rxjs';
import { ReportService } from './report.service';

@Injectable({
  providedIn: 'root',
})
export class ReportResolver implements Resolve<boolean> {
  constructor(private reportService: ReportService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.reportService.reports$.pipe(map(() => true));
  }
}
