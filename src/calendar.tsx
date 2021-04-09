import React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import FullCalendar from '@fullcalendar/react';
import { DateSelectArg, EventClickArg, EventContentArg, formatDate } from '@fullcalendar/react';
import { EventAddArg } from '@fullcalendar/react';
import { EventRemoveArg } from '@fullcalendar/react';
import { EventInput } from '@fullcalendar/react';
import { DatesSetArg } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import rrulePlugin from '@fullcalendar/rrule';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import EventMenu, { EventMenuInfo } from './event-menu';
import EventClick, { EventClickInfo } from './event-click';
import { getFilteredRecurrenceRule } from './date-utils';
import './calendar.css';
import { ADD_EVENT, REMOVE_EVENT } from './mutations';
import { GET_EVENTS } from './queries';

interface FilterParameters {
  startStr: string | undefined;
  endStr: string | undefined;
  tags: string[];
}

interface CalendarProps {
  prevCalled: number,
  nextCalled: number,
  todayCalled: number,
  setTitle: (arg0: string) => void,
  calendarView: string,
  drawerOpen: boolean,
  filters: FilterParameters,
}

interface Event {
  _id: string,
  title: string,
  description: string,
  startStr: string,
  endStr: string | undefined,
  rrule: string | undefined,
  duration: number | undefined,
  allDay: boolean,
}

interface EventList {
  events: Event[];
}

interface GetEventVars {
  location: string;
  filters: FilterParameters;
}

export default function Calendar(props: CalendarProps) {
  const setTitle = props.setTitle;
  const calendarView = props.calendarView;
  const nextCalled = props.nextCalled;
  const prevCalled = props.prevCalled;
  const todayCalled = props.todayCalled;

  const calendarRef = useRef<FullCalendar>();

  const [eventMenuInfo, setEventMenuInfo] = useState<EventMenuInfo>({
    openMenu: false,
    selectInfo: null
  });

  const [eventClickInfo, setEventClickInfo] = useState<EventClickInfo>({
    openMenu: false,
    clickInfo: null
  });

  const [eventArray, setEventArray] = useState<EventInput[]>([]);

  const [addEvent] = useMutation<
    {addEvent: string},
    {location: string, newEvent: Event}
  >(ADD_EVENT);

  const [removeEvent] = useMutation<
    {removeEvent: string},
    {location: string, id: string}
  >(REMOVE_EVENT);
  
  const { loading, data, error } = useQuery<
    EventList,
    GetEventVars
  >(GET_EVENTS, { variables: { 
    location: 'Washington, D.C.',
    filters: props.filters
  }});

  const closeEventMenu = () => {
    if(eventMenuInfo.openMenu) {
      setEventMenuInfo({
        openMenu: false,
        selectInfo: eventMenuInfo.selectInfo
      });
    }
  }

  const handleEventAdd = (addInfo: EventAddArg) => {
    let event = addInfo.event;
    addEvent({ variables: {
        location: "Washington, D.C.",
        newEvent: {
          _id: event.id,
          title: event.title,
          description: event.extendedProps.description,
          startStr: event.start?.toString() ?? '',
          endStr: event.end?.toString() ?? '',
          rrule: event.extendedProps.rrule,
          duration: event.extendedProps.duration,
          allDay: event.allDay,
        }
      }
    });
    closeEventMenu();
  }

  const handleEventRemove = (removeInfo: EventRemoveArg) => {
    removeEvent({ variables: {
        location: "Washington, D.C.",
        id: removeInfo.event.id
      }
    });
  }

  const handleEventChange = () => {
    closeEventMenu();
  }

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setEventMenuInfo({
      openMenu: true,
      selectInfo: selectInfo
    });
  }

  const handleEventClick = (clickInfo: EventClickArg) => {
    setEventClickInfo({
      openMenu: true,
      clickInfo: clickInfo
    });
  }

  const handleEventEdit = (clickInfo: EventClickArg) => {
    setEventClickInfo({
      openMenu: false,
      clickInfo: clickInfo
    });

    setEventMenuInfo({
      openMenu: true,
      selectInfo: clickInfo
    });
  }

  const handleDateChange = ({ view }: DatesSetArg) => {
    let calendarApi = view.calendar;

    setTitle(formatDate(calendarApi.getDate(), {month: 'long', year: 'numeric'}));
  }

  const getCalendarApi = useCallback(() => {
    let calendarRefTmp = calendarRef;
    return calendarRefTmp?.current?.getApi();
  }, [calendarRef]);

  useEffect(() => {
    let calendarApi = getCalendarApi();
    if(calendarApi === undefined) { return; }

    calendarApi.next();
  }, [nextCalled, getCalendarApi]);

  useEffect(() => {
    let calendarApi = getCalendarApi();
    if(calendarApi === undefined) { return; }

    calendarApi.prev();
  }, [prevCalled, getCalendarApi]);

  useEffect(() => {
    let calendarApi = getCalendarApi();
    if(calendarApi === undefined) { return; }

    calendarApi.today();
  }, [todayCalled, getCalendarApi]);

  useEffect(() => {
    let calendarApi = getCalendarApi();
    if(calendarApi === undefined) { return; }

    const viewMap = new Map([
      ["month", "dayGridMonth"], 
      ["week", "timeGridWeek"], 
      ["day", "timeGridDay"]
    ]);

    let value = viewMap.get(calendarView) ?? '';
    calendarApi.changeView(value);
  }, [calendarView, getCalendarApi]);

  useEffect(() => {
    setEventArray(data ? data.events.map(event => {
      let rrule = event.rrule ? getFilteredRecurrenceRule(
        event.rrule,
        props.filters.startStr,
        props.filters.endStr
      ) : undefined;

      return  {
        id: event._id,
        title: event.title,
        extendedProps: {
          description: event.description
        },
        start: new Date(event.startStr),
        end: event.endStr ? new Date(event.endStr) : undefined,
        rrule: rrule,
        duration: event.duration,
        allDay: event.allDay
      }
    }) : []);
  }, [data, setEventArray, props.filters]);

  if (loading) return (<h2 className='message'>Loading...</h2>)
  if (error) return (<h2 className='message'>Error!</h2>)

  return (
    <div className='calendar'>
      <FullCalendar
        ref={calendarRef as React.LegacyRef<FullCalendar>}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin]}
        headerToolbar={false}
        initialView='dayGridMonth'
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        longPressDelay={20}
        events={eventArray} // alternatively, use the `events` setting to fetch from a feed
        select={handleDateSelect}
        eventContent={renderEventContent} // custom render function
        eventClick={handleEventClick}
        //eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
        eventAdd={handleEventAdd}
        eventChange={handleEventChange}
        eventRemove={handleEventRemove}
        unselectAuto={false}
        aspectRatio={1.71}
        fixedWeekCount={false}
        datesSet={handleDateChange}
        //contentHeight={900}
      />
      <EventMenu
        info={eventMenuInfo}
        onClickAway={closeEventMenu}
      />
      <EventClick
        eventClick={eventClickInfo}
        onClickAway={() => {setEventClickInfo({ clickInfo: eventClickInfo.clickInfo, openMenu: false })}}
        onEdit={handleEventEdit}
      />
    </div>
  )
}


function renderEventContent(eventInfo: EventContentArg) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}
