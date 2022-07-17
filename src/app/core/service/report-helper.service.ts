import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { ChartBlock } from '../components/bar-chart/bar-chart.component';
import { Activity } from '../model/activity';
import { ClassReport, CombinedReports, StudentReport } from '../model/report';
import { ReportFilter } from '../model/report-filter';

const API_DATE_FORMAT = 'DD/MM/YY';

const SUMMARY_CONFIG = [
  { color: 'green', name: 'Excellent', func: (v: number) => v > 90 },
  { color: 'orange', name: 'OK', func: (v: number) => v > 80 && v <= 90 },
  { color: 'red', name: 'Week', func: (v: number) => v > 60 && v <= 80 },
  { color: 'gray', name: 'Unassigned', func: (v: number) => v <= 60 },
];

const getGroup = (value: number): string | undefined =>
  SUMMARY_CONFIG.find((config) => {
    return config.func(value);
  })?.name;

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
  }): { reports: StudentReport[]; summary: ChartBlock[] } {
    const { classReports, reportFilter } = config;

    const reports: StudentReport[] = [];

    const filteredClassReport = classReports.find(
      (classReport) => classReport.name === reportFilter.class
    );

    const filteredStudents = !reportFilter.students?.length
      ? filteredClassReport?.students
      : filteredClassReport?.students.filter((student) =>
          reportFilter.students.includes(student.student)
        );

    const matchWithWeeks = (fromDate: string, toDate: string, date: string) => {
      // TODO: FIX: Date filtering
      return (
        !moment(fromDate, API_DATE_FORMAT).isBefore(date) &&
        !moment(toDate, API_DATE_FORMAT).isAfter(date)
      );
    };

    const summaryMap = new Map<string, ChartBlock>(
      SUMMARY_CONFIG.map((config) => [
        config.name,
        { name: config.name, color: config.color, value: 0 },
      ])
    );

    filteredStudents?.forEach((student) => {
      student.activities.forEach((activity) => {
        const { content, skill, time, type, attempts } = activity;
        const { weeks: datesCompleted, values: respectResults } = attempts;
        datesCompleted.forEach((date, i) => {
          if (
            matchWithWeeks(reportFilter.fromDate, reportFilter.toDate, date)
          ) {
            const result = respectResults[i];
            const group = getGroup(result);

            const block = summaryMap.get(group || '');
            if (block) {
              block.value++;
            }

            reports.push({
              content,
              skill,
              time,
              type,
              date: date,
              result: result,
              x: student,
            } as StudentReport);
          }
        });
      });
    });

    const summary = Array.from(summaryMap.values());

    return { reports, summary };
  }
}