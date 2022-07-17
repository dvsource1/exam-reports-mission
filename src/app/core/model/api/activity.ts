import { ActivityAttempts } from './activity-attempts';

/**
 * Student activity API model
 * @author <virajkaush@gmail.com>
 * @since  2022.07.17
 */
export interface Activity {
  id: number;
  type: string;
  time: string;
  skill: string;
  student: string;
  content: string;
  attempts: ActivityAttempts;
}
