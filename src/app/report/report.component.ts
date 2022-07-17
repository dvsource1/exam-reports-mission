import { Component } from '@angular/core';
import { combineLatest, map, Observable, shareReplay, tap } from 'rxjs';
import { Activity } from '../core/model/activity';
import { Class } from '../core/model/class';
import { ReportService } from './report.service';

export type CombinedReport = {
  classes: Class[];
  activities: Activity[];
};

export type Report = {
  students: {
    student: string;
    activities: Activity[];
  }[];
  id: number;
  name: string;
};

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.sass'],
})
export class ReportComponent {
  constructor(private reportService: ReportService) {}

  reports$: Observable<Report[]> = combineLatest({
    classes: this.reportService.getClasses(),
    activities: this.reportService.getActivities(),
  }).pipe(
    map((x) => this.mapCombinedReportData(x)),
    shareReplay(1),
    tap()
  );

  private mapCombinedReportData = (
    combinedReport: CombinedReport
  ): Report[] => {
    const studentActivityMap = new Map<string, Activity[]>();
    combinedReport.activities.forEach((activity) => {
      if (!studentActivityMap.has(activity.student)) {
        studentActivityMap.set(activity.student, []);
      }
      studentActivityMap.get(activity.student)?.push(activity);
    });

    return combinedReport.classes.map((cls) => {
      return {
        ...cls,
        students: cls.students.map((student) => {
          return {
            student,
            activities: studentActivityMap.get(student) || [],
          };
        }),
      };
    });
  };
}
