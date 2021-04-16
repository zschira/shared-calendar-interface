import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client';
import { EventInput } from '@fullcalendar/react';
import { Switch, Route } from 'react-router-dom';

import Calendar, { Event } from './calendar'
import Resources from './resources'
import FilterBar from './filters'
import { GET_EVENTS } from './queries';
import ResourceForm from './add-resources';
import { getFilteredRecurrenceRule } from './date-utils';

interface ContentProps {
  prevCalled: number,
  nextCalled: number,
  todayCalled: number,
  setTitle: (arg0: string) => void,
  calendarView: string,
  drawerOpen: boolean,
}

interface EventList {
  events: Event[];
}

interface FilterParameters {
  startStr: string | undefined;
  endStr: string | undefined;
  tags: string[];
}

interface QueryVars {
  location: string;
  filters: FilterParameters;
}

interface ResourceRef {
  tags: string[]
}

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    resourceContainer: {
      display: 'flex',
      flexDirection: 'row',
      marginTop: 60,
    },
    calendar: {
      flexGrow: 15,
    },
  })
);

export default function Content(props: ContentProps) {
  const classes = useStyles();

  const [rangeStartStr, setRangeStartStr] = useState('');
  const [rangeEndStr, setRangeEndStr] = useState('');
  const [eventArray, setEventArray] = useState<EventInput[]>([]);
  const [tagMap, setTagMap] = useState<Map<string, boolean>>(new Map());
  const [tags, setTags] = useState<string[]>([]);
  const [updateCounter, setUpdateCounter] = useState(0);

  const { loading, data, error } = useQuery<
    EventList,
    QueryVars
  >(GET_EVENTS, { variables: { 
    location: 'Washington, D.C.',
    filters: {
      startStr: rangeStartStr,
      endStr: rangeEndStr,
      tags: tags
    }
  }});

  useEffect(() => {
    setEventArray(data ? data.events.map(event => {
      let rrule = event.rrule ? getFilteredRecurrenceRule(
        event.rrule,
        rangeStartStr,
        rangeEndStr
      ) : undefined;

      return  {
        id: event._id,
        title: event.title,
        extendedProps: {
          description: event.description,
          resources: event.resources
        },
        start: new Date(event.startStr),
        end: event.endStr ? new Date(event.endStr) : undefined,
        rrule: rrule,
        duration: event.duration,
        allDay: event.allDay
      }
    }) : []);
  }, [data, setEventArray, rangeStartStr, rangeEndStr]);

  useEffect(() => {
    eventArray.forEach((event) => {
      event.extendedProps?.resources?.forEach((resource: ResourceRef) => {
        resource.tags.forEach(tag => {
          setTagMap(tagMap => tagMap.set(tag, tagMap.get(tag) ?? false));
        });
      });
    });
    setUpdateCounter(updateCounter => updateCounter + 1);
  }, [eventArray, setTagMap, setUpdateCounter]);

  const setQueryTagsChecked = (tag: string) => {
    setTagMap(tagMap => tagMap.set(tag, !tagMap.get(tag)));
    setTags(tags => {
      return tags.includes(tag) ? tags.filter(val => val != tag) : tags.concat(tag);
    });
  }

  return(
    <Switch>
      <Route path="/attachments/:eventId">
        <ResourceForm />
      </Route>
      <Route path="/">
        <div className={classes.resourceContainer}>
          <FilterBar 
            tags={tagMap}
            setQueryTags={setQueryTagsChecked}
            setRangeStartStr={setRangeStartStr}
            setRangeEndStr={setRangeEndStr}
            rangeStartStr={rangeStartStr}
            rangeEndStr={rangeEndStr}
          />

          <Switch>
            <Route path="/resources">
              <Resources
                resourceID={[]}
              />
            </Route>
            <Route path="/">
              <div className={classes.calendar}>
                <Calendar
                  prevCalled={props.prevCalled}
                  nextCalled={props.nextCalled}
                  todayCalled={props.todayCalled}
                  setTitle={props.setTitle}
                  calendarView={props.calendarView}
                  drawerOpen={props.drawerOpen}
                  eventArray={eventArray}
                />
              </div>
            </Route>
          </Switch>
        </div>
      </Route>
    </Switch>
  );
}
