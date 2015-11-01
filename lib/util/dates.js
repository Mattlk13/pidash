function dateFloor(date, interval) {
  var msecsDate = date instanceof Date ? date.getTime() : date;
  return new Date(Math.floor(msecsDate / interval) * interval);
}

export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR   = 60 * MINUTE;
export const DAY    = 24 * HOUR;

export function tomorrow() {
  return dateFloor(Date.now()+DAY, DAY);
}

export function beginningOfMinute(d = new Date()) {
  return dateFloor(d, MINUTE);
}
export function beginningOfNextMinute(d = new Date()) {
  return dateFloor(d.getTime() + MINUTE, MINUTE);
}
