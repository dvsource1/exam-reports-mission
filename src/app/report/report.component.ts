import { ChangeDetectionStrategy, Component } from '@angular/core';
import * as moment from 'moment';
import {
  combineLatest,
  map,
  Observable,
  shareReplay,
  Subject,
  tap,
} from 'rxjs';
import { Activity } from '../core/model/activity';
import { Class } from '../core/model/class';
import { ReportService } from './report.service';

// TODO: move to core/@types
export type CombinedReport = {
  classes: Class[];
  activities: Activity[];
};

export type ClassReport = {
  students: {
    student: string;
    activities: Activity[];
  }[];
  id: number;
  name: string;
};

export type StudentReport = Pick<
  Activity,
  'content' | 'type' | 'skill' | 'time'
> & { date: string; result: number; x: any };

export interface Filter {
  class: string;
  student: string;
  fromDate: string;
  toDate: string;
}

const API_DATE_FORMAT = 'DD/MM/YY';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportComponent {
  filter$ = new Subject<Filter>();

  classesToStudentsMap: Map<string, string[]> = new Map<string, string[]>();

  constructor(private reportService: ReportService) {}

  private mapCombinedReportData = (
    combinedReport: CombinedReport
  ): ClassReport[] => {
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

  private initFilters(
    combinedReport: CombinedReport,
    filter$: Subject<Filter>
  ): void {
    this.classesToStudentsMap = new Map<string, string[]>();
    combinedReport.classes.forEach((cls) => {
      this.classesToStudentsMap.set(cls.name, cls.students);
    });

    filter$.next({
      class: combinedReport.classes[0].name,
      student:
        this.classesToStudentsMap.get(combinedReport.classes[0].name)?.[0] ||
        '',
      fromDate: '2000-07-14', // TODO: remove hardcode
      toDate: '2020-07-14', // TODO: remove hardcode
    });
  }

  private filterResults(config: {
    classReports: ClassReport[];
    filter: Filter;
  }): StudentReport[] {
    const { classReports, filter } = config;

    const reports: StudentReport[] = [];

    const filteredClassReport = classReports.find(
      (classReport) => classReport.name === filter.class
    );

    const filteredStudents = filteredClassReport?.students.filter(
      (student) => student.student === filter.student
      // filter.student.includes(student.student)
    );

    const matchWithWeeks = (fromDate: string, toDate: string, date: string) => {
      // TODO: FIX: Date filtering
      return (
        !moment(fromDate, API_DATE_FORMAT).isBefore(date) &&
        !moment(toDate, API_DATE_FORMAT).isAfter(date)
      );
    };

    filteredStudents?.forEach((student) => {
      student.activities.forEach((activity) => {
        const { content, skill, time, type, attempts } = activity;
        const { weeks: datesCompleted, values: respectResults } = attempts;
        datesCompleted.forEach((date, i) => {
          if (matchWithWeeks(filter.fromDate, filter.toDate, date)) {
            reports.push({
              content,
              skill,
              time,
              type,
              date: date,
              result: respectResults[i],
              x: student,
            } as StudentReport);
          }
        });
      });
    });

    return reports;
  }

  classReports$: Observable<ClassReport[]> = combineLatest({
    classes: this.reportService.getClasses(),
    activities: this.reportService.getActivities(),
  }).pipe(
    tap((d) => this.initFilters(d, this.filter$)),
    map(this.mapCombinedReportData),
    shareReplay(1),
    tap(console.log)
  );

  studentReports$ = combineLatest({
    classReports: this.classReports$,
    filter: this.filter$,
  }).pipe(tap(console.log), map(this.filterResults), tap(console.log));
}
