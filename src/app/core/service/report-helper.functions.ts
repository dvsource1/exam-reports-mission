import * as moment from 'moment';
import { API_DATE_FORMAT, DATE_PICKER_DATE_FORMAT } from '../util/constants';

/**
 * Class report summary creation config
 */
export const SUMMARY_CONFIG = [
  { color: 'gray', name: 'Unassigned', func: (v: number) => v <= 60 },
  { color: 'red', name: 'Week', func: (v: number) => v > 60 && v <= 80 },
  { color: 'orange', name: 'OK', func: (v: number) => v > 80 && v <= 90 },
  { color: 'green', name: 'Excellent', func: (v: number) => v > 90 },
];

/**
 * get class report summary group
 * @param value
 * @returns
 */
export const getGroup = (value: number): string | undefined =>
  SUMMARY_CONFIG.find((config) => {
    return config.func(value);
  })?.name;

/**
 * check is date between fromDate & to date
 * @param {string} fromDate format: 'DD/MM/YY'
 * @param {string} toDate format: 'DD/MM/YY'
 * @param {string} date format: 'YYYY-MM-DD'
 * @returns
 */
export const matchWithWeeks = (
  fromDate: string,
  toDate: string,
  date: string
) => {
  const mFromDate = moment(fromDate, DATE_PICKER_DATE_FORMAT);
  const mToDate = moment(toDate, DATE_PICKER_DATE_FORMAT);
  const mDate = moment(date, API_DATE_FORMAT);
  if (mFromDate.isAfter(mToDate)) {
    return true;
  }
  return !mDate.isBefore(mFromDate) && !mDate.isAfter(mToDate);
};
