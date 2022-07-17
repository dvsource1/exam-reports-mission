import { Activity } from './activity';
import { Class } from './class';

export type CombinedReports = {
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
