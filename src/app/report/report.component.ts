import { ChangeDetectionStrategy, Component } from '@angular/core';
import { combineLatest, map, Observable, Subject, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ClassReport, CombinedReports } from '../core/model/ui/report';
import { ReportFilter } from '../core/model/ui/report-filter';
import { ReportHelperService } from '../core/service/report-helper.service';
import { ReportService } from './report.service';

/**
 * Reports view component
 * @author <virajkaush@gmail.com>
 * @since  2022.07.17
 */
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportComponent {
  /**
   * filter subject
   */
  filter$ = new Subject<ReportFilter>();

  /**
   * local state for classes & students filters
   */
  classesToStudentsMap: Map<string, string[]> = new Map<string, string[]>();

  constructor(
    private reportService: ReportService,
    private reportHelperService: ReportHelperService,
    private authService: AuthService
  ) {}

  /**
   * initialize classes and students local states
   * send initial filter event
   * @param combinedReport combined[classes & activities] response
   * @param filter$        filter subject
   */
  private initFilters(
    combinedReport: CombinedReports,
    filter$: Subject<ReportFilter>
  ): void {
    this.classesToStudentsMap = new Map<string, string[]>();
    combinedReport.classes.forEach((cls) => {
      this.classesToStudentsMap.set(cls.name, cls.students);
    });

    // TODO: investigate on filter$ subject .next()
    setTimeout(() => {
      filter$.next({
        class: combinedReport.classes[0].name,
        students:
          this.classesToStudentsMap.get(combinedReport.classes[0].name) || [],
        fromDate: '2000-07-14', // TODO: remove hardcode
        toDate: '2020-07-14', // TODO: remove hardcode
      });
    });
  }

  /**
   * mapped class reports `Observable`
   */
  private classReports$: Observable<ClassReport[]> =
    this.reportService.reports$.pipe(
      tap((x) => this.initFilters(x, this.filter$)),
      map(this.reportHelperService.mapCombinedReportData)
    );

  /**
   * mapped student reports `Observable`
   * combined with filter subject
   */
  public studentReports$ = combineLatest({
    classReports: this.classReports$,
    reportFilter: this.filter$,
  }).pipe(map(this.reportHelperService.filterResults));

  /**
   * trigger auth logout
   */
  public async onLogout() {
    this.authService.logout();
  }
}
