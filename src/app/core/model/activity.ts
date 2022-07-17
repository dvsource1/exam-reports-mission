import { ActivityAttempts } from './activity-attempts';

export interface Activity {
  id: number;
  type: string;
  time: string;
  skill: string;
  student: string;
  content: string;
  attempts: ActivityAttempts;
}
