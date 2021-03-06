import React from 'react'
import FullCalendar from '@fullcalendar/react'
import { DateSelectArg, EventClickArg, EventContentArg, formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import rrulePlugin from '@fullcalendar/rrule'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import EventMenu, { EventMenuInfo } from './event-menu'
import EventClick, { EventClickInfo } from './event-click'
import './calendar.css'

interface CalendarState {
  eventMenuInfo: EventMenuInfo,
  eventClickInfo: EventClickInfo,
}

interface CalendarProps {
  prevCalled: number,
  nextCalled: number,
  todayCalled: number,
  setTitle: (arg0: string) => void,
  calendarView: string,
  drawerOpen: boolean,
}

export default class Calendar extends React.Component<CalendarProps, CalendarState> {
  calendarRef = React.createRef<FullCalendar>();
  viewMap = new Map([["month", "dayGridMonth"], ["week", "timeGridWeek"], ["day", "timeGridDay"]]);

  constructor(props: CalendarProps) {
    super(props);

    this.state = {
      eventMenuInfo: {
        openMenu: false,
        selectInfo: null,
      },
      eventClickInfo: {
          openMenu: false,
          clickInfo: null
      },
    }
  }

  render() {

    return (
      <div className='calendar'>
        <div className='calendar-main'>
          <FullCalendar
            ref={this.calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin]}
            headerToolbar={false}
            initialView='dayGridMonth'
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            longPressDelay={20}
            //initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
            select={this.handleDateSelect}
            eventContent={renderEventContent} // custom render function
            eventClick={this.handleEventClick}
            //eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
            eventAdd={this.handleEventAdd}
            unselectAuto={false}
            contentHeight={900}
            /* you can update a remote database when these fire:
            eventChange={function(){}}
            eventRemove={function(){}}
            */
          />
          <EventMenu
            info={this.state.eventMenuInfo}
            onClickAway={this.closeEventMenu}
          />
          <EventClick
            eventClick={this.state.eventClickInfo}
            onClickAway={() => {this.setState({ eventClickInfo: { clickInfo: null, openMenu: false }})}}
          />
        </div>
      </div>
    )
  }

  closeEventMenu = () => {
    if(this.state.eventMenuInfo.openMenu) {
      this.setState({
        eventMenuInfo: {
          openMenu: false,
          selectInfo: null
        }
      })
    }
  }

  handleEventAdd = () => {
    this.closeEventMenu();
  }

  handleDateSelect = (selectInfo: DateSelectArg) => {
    this.setState({
      eventMenuInfo: {
        openMenu: true,
        selectInfo: selectInfo
      }
    })
  }

  handleEventClick = (clickInfo: EventClickArg) => {
    this.setState({
      eventClickInfo: {
        openMenu: true,
        clickInfo: clickInfo
      }
    })
  }

  componentDidMount() {
    let calendarRef = this.calendarRef;
    let calendarApi = calendarRef?.current?.getApi();
    if(calendarApi === undefined) { return; }

    this.props.setTitle(formatDate(calendarApi.getDate(), {month: 'long', year: 'numeric'}))
  }

  componentDidUpdate(prevProps: CalendarProps) {
    let calendarRef = this.calendarRef;
    let calendarApi = calendarRef?.current?.getApi();
    if(calendarApi === undefined) { return; }

    if(this.props.nextCalled !== prevProps.nextCalled) {
      calendarApi.next();
      this.props.setTitle(formatDate(calendarApi.getDate(), {month: 'long', year: 'numeric'}))
    } else if(this.props.prevCalled !== prevProps.prevCalled) {
      calendarApi.prev();
      this.props.setTitle(formatDate(calendarApi.getDate(), {month: 'long', year: 'numeric'}))
    } else if(this.props.todayCalled !== prevProps.todayCalled) {
      calendarApi.today();
      this.props.setTitle(formatDate(calendarApi.getDate(), {month: 'long', year: 'numeric'}))
    } else if(this.props.calendarView !== prevProps.calendarView) {
      let value = this.viewMap.get(this.props.calendarView) ?? '';
      calendarApi.changeView(value);
    }
  }
}


function renderEventContent(eventInfo: EventContentArg) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}
