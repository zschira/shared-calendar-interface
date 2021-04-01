import { rrulestr } from 'rrule'

export default function Filter() {
  this.filters = [];
}

Filter.prototype.startDate = function(startStr) {
  const filterStartDate = (startStr, eventDoc) => {
    if(eventDoc.rrule !== undefined) {
      let recurrence = rrulestr(eventDoc.rrule);
      let start = new Date(startStr);

      // Check if there are occurences after start filter
      return Boolean(recurrence.after(start, true));
    }

    return new Date(startStr) <= new Date(eventDoc.startStr);
  }

  if(!isNaN(new Date(startStr).getTime())) {
    this.filters.push((eventDoc) => {
      return filterStartDate(startStr, eventDoc);
    });
  }

  return this;
}

Filter.prototype.endDate = function(endStr) {
  const filterEndDate = (endStr, eventDoc) => {
    if(eventDoc.rrule !== undefined) {
      let recurrence = rrulestr(eventDoc.rrule);
      let end = new Date(endStr);

      // Check if there are occurences after start filter
      return Boolean(recurrence.before(end, true));
    }

    return new Date(endStr) >= new Date(eventDoc.startStr);
  }

  if(!isNaN(new Date(endStr).getTime())) {
    this.filters.push((eventDoc) => {
      return filterEndDate(endStr, eventDoc);
    });
  }

  return this;
}

Filter.prototype.create = function() {
  return (eventDoc) => {
    return this.filters.reduce((passed, filter) => passed & filter(eventDoc), true);
  }
}
