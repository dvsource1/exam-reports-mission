/**
 * Class report summary creation config
 */
export const SUMMARY_CONFIG = [
  { color: 'green', name: 'Excellent', func: (v: number) => v > 90 },
  { color: 'orange', name: 'OK', func: (v: number) => v > 80 && v <= 90 },
  { color: 'red', name: 'Week', func: (v: number) => v > 60 && v <= 80 },
  { color: 'gray', name: 'Unassigned', func: (v: number) => v <= 60 },
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
