import { RRule } from 'rrule'

const zeroPad = (num: number, places: number) => String(num).padStart(places, '0');

export function  getDateStr(date: Date) {
  return `${date.getFullYear()}-${zeroPad(date.getMonth() + 1, 2)}-${zeroPad(date.getDate(), 2)}`;
}

export function getTimeStr(date: Date) {
  return `${zeroPad(date.getHours(), 2)}:${zeroPad(date.getMinutes(), 2)}`;
}

export function getWeekOfMonth(date: Date, exact: boolean) {
    var month = date.getMonth()
        , year = date.getFullYear()
        , firstWeekday = new Date(year, month, 1).getDay()
        , lastDateOfMonth = new Date(year, month + 1, 0).getDate()
        , offsetDate = date.getDate() + firstWeekday - 1
        , index = 1 // start index at 0 or 1, your choice
        , weeksInMonth = index + Math.ceil((lastDateOfMonth + firstWeekday - 7) / 7)
        , week = index + Math.floor(offsetDate / 7)
    ;
    if (exact || week < 2 + index) return week;
    return week === weeksInMonth ? index + 5 : week;
};

export function getWeekAndDayStr(date: Date) {
    
  var days = ['Sunday','Monday','Tuesday','Wednesday',
              'Thursday','Friday','Saturday'],
  prefixes = ['first', 'second', 'third', 'fourth', 'fifth'];

  return prefixes[getWeekOfMonth(date, true) - 1] + ' ' + days[date.getDay()];
}

export function getWeekDayRule(day: number, week: number) {
  switch(day) {
    case 0:
      return RRule.SU.nth(week);
    case 1:
      return RRule.MO.nth(week);
    case 2:
      return RRule.TU.nth(week);
    case 3:
      return RRule.WE.nth(week);
    case 4:
      return RRule.TH.nth(week);
    case 5:
      return RRule.FR.nth(week);
    case 6:
      return RRule.SA.nth(week);
  }
}

export function getFormattedDateStr(date: Date | undefined | null) {
  let options: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  return date?.toLocaleString(undefined, options) ?? '';
}
