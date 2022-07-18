import { Injectable } from '@angular/core';
import { ChartBlock } from '../components/bar-chart/bar-chart.component';
import { Activity } from '../model/api/activity';
import {
  ClassReport,
  CombinedReports,
  StudentReport,
} from '../model/ui/report';
import { ReportFilter } from '../model/ui/report-filter';
import {
  getGroup,
  matchWithWeeks,
  SUMMARY_CONFIG,
} from './report-helper.functions';

/**
 * Responsible helping reposrt view component
 * filtering complex data structures
 * @author <virajkaush@gmail.com>
 * @since  2022.07.17
 */
@Injectable({
  providedIn: 'root',
})
export class ReportHelperService {
  /**
   * map classes, students & activities to same model
   * @param   {CombinedReports} combinedReport
   * @returns {ClassReport[]}
   */
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

  /**
   * filter class reports by filter criteria
   * map to student reports
   * create class report summary => for a bar chart
   * @param config contains results and filter criteria
   * @returns {{ reports: StudentReport[]; summary: ChartBlock[] }}
   */
  public filterResults(config: {
    classReports: ClassReport[];
    reportFilter: ReportFilter;
  }): { details: StudentReport[]; summary: ChartBlock[] } {
    const { classReports, reportFilter } = config;

    const details: StudentReport[] = [];

    const filteredClassReport = classReports.find(
      (classReport) => classReport.name === reportFilter.class
    );

    const filteredStudents = !reportFilter.students?.length
      ? filteredClassReport?.students
      : filteredClassReport?.students.filter((student) =>
          reportFilter.students.includes(student.student)
        );

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
          const isFilterDatesMatchWithWeeks = matchWithWeeks(
            reportFilter.fromDate,
            reportFilter.toDate,
            date
          );
          if (isFilterDatesMatchWithWeeks) {
            const result = respectResults[i];
            const group = getGroup(result);

            // increment block group count
            // later helps to calculate percentage
            const block = summaryMap.get(group || '');
            if (block) {
              block.value++;
            }

            details.push({
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

    return { details, summary };
  }
}
