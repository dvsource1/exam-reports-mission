import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Activity } from '../model/activity';
import { ClassReport, CombinedReports, StudentReport } from '../model/report';
import { ReportFilter } from '../model/report-filter';

const API_DATE_FORMAT = 'DD/MM/YY';

@Injectable({
  providedIn: 'root',
})
export class ReportHelperService {
  constructor() {}

  public mapCombinedReportData = (
    combinedReport: CombinedReports
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

  public filterResults(config: {
    classReports: ClassReport[];
    reportFilter: ReportFilter;
  }): StudentReport[] {
    const { classReports, reportFilter } = config;

    const reports: StudentReport[] = [];

    const filteredClassReport = classReports.find(
      (classReport) => classReport.name === reportFilter.class
    );

    const filteredStudents = filteredClassReport?.students.filter((student) =>
      reportFilter.students.includes(student.student)
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
          if (
            matchWithWeeks(reportFilter.fromDate, reportFilter.toDate, date)
          ) {
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
}
