import { rrulestr } from 'rrule'

export function Filter() {
  this.filters = [];
}

Filter.prototype.startDate = function(startStr) {
  const filterStartDate = (startStr, event) => {
    if(event.rrule() !== undefined) {
      let recurrence = rrulestr(event.rrule());
      let start = new Date(startStr);

      // Check if there are occurences after start filter
      return Boolean(recurrence.after(start, true));
    }

    return new Date(startStr) <= event.startDate();
  }

  if(!isNaN(new Date(startStr).getTime())) {
    this.filters.push((event) => {
      return filterStartDate(startStr, event);
    });
  }

  return this;
}

Filter.prototype.endDate = function(endStr) {
  const filterEndDate = (endStr, event) => {
    if(event.rrule() !== undefined) {
      let recurrence = rrulestr(event.rrule());
      let end = new Date(endStr);

      // Check if there are occurences after start filter
      return Boolean(recurrence.before(end, true));
    }

    return new Date(endStr) >= new Date(event.startDate());
  }

  if(!isNaN(new Date(endStr).getTime())) {
    this.filters.push((event) => {
      return filterEndDate(endStr, event);
    });
  }

  return this;
}

Filter.prototype.tags = function(queryTags) {
  const filterTags = (queryTags, event) => {
    if(queryTags.length === 0) { return true; }

    return queryTags.reduce((included, tag) => {
      return event.includesTag(tag) || included;
    }, false);
  }

  this.filters.push((event) => {
    return filterTags(queryTags, event);
  });

  return this;
}

Filter.prototype.create = function() {
  return (event) => {
    return this.filters.reduce((passed, filter) => passed && filter(event), true);
  }
}

export function Event(eventDoc, getResources) {
  this.event = {
    ...eventDoc,
    resources: getResources(eventDoc._id).map((doc) => new Resource(doc))
  };
}

Event.prototype.schemaView = function() {
  return {
    ...this.event,
    resources: this.event.resources.map(resource => resource.schemaView())
  };
}

Event.prototype.startDate = function() {
  return new Date(this.event.startStr);
}

Event.prototype.endDate = function() {
  return new Date(this.event.enStr);
}

Event.prototype.rrule = function() {
  return this.event.rrule;
}

Event.prototype.includesTag = function(tag) {
  return this.event.resources.reduce((included, resource) => {
    return resource.includesTag(tag) || included;
  }, false);
}

export function Resource(resourceDoc) {
  this.resource = {
    ...resourceDoc,
    tags: resourceDoc.tags.split(',').map(tag => tag.trim())
  }
}

Resource.prototype.includesTag = function(tag) {
  return this.resource.tags.includes(tag);
}

Resource.prototype.schemaView = function() {
  return this.resource;
}
