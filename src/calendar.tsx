import React from 'react'
import FullCalendar from '@fullcalendar/react'
import { DateSelectArg, EventClickArg, EventContentArg } from '@fullcalendar/react'
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

export default class Calendar extends React.Component<{}, CalendarState> {
  state: CalendarState = {
    eventMenuInfo: {
      openMenu: false,
      selectInfo: null,
    },
    eventClickInfo: {
        openMenu: false,
        clickInfo: null
    }
  }

  render() {
    return (
      <div className='calendar'>
        <div className='calendar-main'>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            initialView='dayGridMonth'
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            //initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
            select={this.handleDateSelect}
            eventContent={renderEventContent} // custom render function
            eventClick={this.handleEventClick}
            //eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
            eventAdd={this.handleEventAdd}
            unselectAuto={false}
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
}


function renderEventContent(eventInfo: EventContentArg) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}
