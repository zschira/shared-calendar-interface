import React from 'react'
import { useState, useEffect, useCallback, useRef } from 'react';
import FullCalendar from '@fullcalendar/react'
import { DateSelectArg, EventClickArg, EventContentArg, formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import rrulePlugin from '@fullcalendar/rrule'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import EventMenu, { EventMenuInfo } from './event-menu'
import EventClick, { EventClickInfo } from './event-click'
import './calendar.css'

interface CalendarProps {
  prevCalled: number,
  nextCalled: number,
  todayCalled: number,
  setTitle: (arg0: string) => void,
  calendarView: string,
  drawerOpen: boolean,
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

  const closeEventMenu = () => {
    if(eventMenuInfo.openMenu) {
      setEventMenuInfo({
        openMenu: false,
        selectInfo: null
      });
    }
  }

  const handleEventAdd = () => {
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

  const getCalendarApi = useCallback(() => {
    let calendarRefTmp = calendarRef;
    return calendarRefTmp?.current?.getApi();
  }, [calendarRef]);

  useEffect(() => {
    let calendarApi = getCalendarApi();
    if(calendarApi === undefined) { return; }

    calendarApi.next();
    setTitle(formatDate(calendarApi.getDate(), {month: 'long', year: 'numeric'}))
  }, [nextCalled, getCalendarApi, setTitle]);

  useEffect(() => {
    let calendarApi = getCalendarApi();
    if(calendarApi === undefined) { return; }

    calendarApi.prev();
    setTitle(formatDate(calendarApi.getDate(), {month: 'long', year: 'numeric'}))
  }, [prevCalled, getCalendarApi, setTitle]);

  useEffect(() => {
    let calendarApi = getCalendarApi();
    if(calendarApi === undefined) { return; }

    calendarApi.today();
    setTitle(formatDate(calendarApi.getDate(), {month: 'long', year: 'numeric'}))
  }, [todayCalled, getCalendarApi, setTitle]);

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
    let calendarApi = getCalendarApi();
    if(calendarApi === undefined) { return; }

    setTitle(formatDate(calendarApi.getDate(), {month: 'long', year: 'numeric'}))
  }, [getCalendarApi, setTitle]);

  return (
    <div className='calendar'>
      <div className='calendar-main'>
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
          //initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
          select={handleDateSelect}
          eventContent={renderEventContent} // custom render function
          eventClick={handleEventClick}
          //eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
          eventAdd={handleEventAdd}
          unselectAuto={false}
          contentHeight={900}
          /* you can update a remote database when these fire:
          eventChange={function(){}}
          eventRemove={function(){}}
          */
        />
        <EventMenu
          info={eventMenuInfo}
          onClickAway={closeEventMenu}
        />
        <EventClick
          eventClick={eventClickInfo}
          onClickAway={() => {setEventClickInfo({ clickInfo: null, openMenu: false })}}
        />
      </div>
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
