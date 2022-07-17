import { ChangeDetectionStrategy, Component } from '@angular/core';
import { combineLatest, map, Observable, Subject, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ClassReport, CombinedReports } from '../core/model/report';
import { ReportFilter } from '../core/model/report-filter';
import { ReportHelperService } from '../core/service/report-helper.service';
import { ReportService } from './report.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportComponent {
  filter$ = new Subject<ReportFilter>();

  classesToStudentsMap: Map<string, string[]> = new Map<string, string[]>();

  constructor(
    private reportService: ReportService,
    private reportHelperService: ReportHelperService,
    private authService: AuthService
  ) {}

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

  classReports$: Observable<ClassReport[]> = this.reportService.reports$.pipe(
    tap((x) => this.initFilters(x, this.filter$)),
    map(this.reportHelperService.mapCombinedReportData)
  );

  studentReports$ = combineLatest({
    classReports: this.classReports$,
    reportFilter: this.filter$,
  }).pipe(map(this.reportHelperService.filterResults));

  async onLogout() {
    this.authService.logout();
  }
}
