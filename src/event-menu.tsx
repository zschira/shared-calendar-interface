import React from 'react'
import { Popover, Paper, Select, MenuItem, TextField, Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import { createEventId } from './event-utils'
import { DateSelectArg, CalendarApi } from '@fullcalendar/react'
import { getDateStr, getTimeStr, getWeekAndDayStr, getWeekDayRule, getWeekOfMonth } from './date-utils'
import './event-menu.css'

export interface EventMenuInfo {
  openMenu: boolean,
  selectInfo: DateSelectArg | null
}

export interface EventMenuProps {
  info: EventMenuInfo,
  onClickAway: () => void,
}

export interface EventMenuState {
  title: string,
  description: string,
  startDate: Date | null,
  endDate: Date | null,
  allDay: boolean | undefined,
  recurrence: string
}

export default class EventMenu extends React.Component<EventMenuProps, EventMenuState> {
  constructor(props: EventMenuProps) {
    super(props);

    this.state = {
      title: '',
      description: '',
      startDate: null,
      endDate: null,
      allDay: undefined,
      recurrence: 'never'
    }

    this.handleEventMenuChanged = this.handleEventMenuChanged.bind(this);
    this.handleDateChanged = this.handleDateChanged.bind(this);
    this.handleTimeChanged = this.handleTimeChanged.bind(this);
  }

  resetDefaultState(calendarApi: CalendarApi | undefined) {
    this.setState({
      title: '',
      description: '',
      startDate: null,
      endDate: null,
      allDay: undefined,
      recurrence: 'never'
    })

    calendarApi?.unselect();
  }

  handleEventMenuChanged(event: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    const name = target.name;

    switch (name) {
      case 'title':
        this.setState({ title: value });
        break;
      case 'description':
        this.setState({ description: value });
        break;
      case 'recurrence':
        this.setState({ recurrence: value });
        break;
    }
  }

  handleEventCreate(selectInfo: DateSelectArg | null) {
    if(selectInfo === null) {
      return;
    }

    let calendarApi = selectInfo.view.calendar;

    if(this.state.recurrence === 'never') {
        this.createNormalEvent(calendarApi);
    } else {
        this.createRecurringEvent(calendarApi);
    }

    this.resetDefaultState(calendarApi);
  }

  createNormalEvent(calendarApi: CalendarApi) {
    let start = this.getDate('startDate');
    let end = this.getDate('endDate');
    
    calendarApi.addEvent({
      id: createEventId(),
      title: this.state.title,
      extendedProps: {
        description: this.state.description,
      },
      start: start ? start.toISOString() : '',
      end: end ? end.toISOString() : '',
      allDay: this.getAllDay()
    });
  }

  createRecurringEvent(calendarApi: CalendarApi) {
    let start = this.getDate('startDate') ?? new Date();
    let end = this.getDate('endDate') ?? new Date();

    let byWeekDay = null;
    if(this.state.recurrence === 'monthly') {
      byWeekDay = getWeekDayRule(start.getDay(), getWeekOfMonth(start, true));
    }

    calendarApi.addEvent({
      id: createEventId(),
      title: this.state.title,
      extendedProps: {
        description: this.state.description,
      },
      rrule: {
        freq: this.state.recurrence,
        dtstart: start.toISOString(),
        byweekday: byWeekDay
      },
      duration: end.getTime() - start.getTime()
    });
  }
  
  handleDateChanged(event: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) {
    const target = event.target as HTMLInputElement;
    const value = target.value.split('-');
    const name = target.name;

    let date = this.getDate(name) ?? new Date();
    date.setFullYear(parseInt(value[0]));
    date.setMonth(parseInt(value[1]) - 1);
    date.setDate(parseInt(value[2]));

    name === 'startDate' ? this.setState({ startDate: date}) : this.setState({ endDate: date});
  }

  handleTimeChanged(event: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) {
    const target = event.target as HTMLInputElement;
    const value = target.value.split(':');
    const name = target.name;

    let date = this.getDate(name) ?? new Date();
    date.setHours(parseInt(value[0]));
    date.setMinutes(parseInt(value[1]));

    name === 'startDate' ? this.setState({ startDate: date}) : this.setState({ endDate: date});
  }

  getDate(name: string) {
    let date = null;

    if(name === 'startDate') {
      date = this.state.startDate;
      if(date === null) {
        date = this.props.info.selectInfo?.start;
      }
    } else if(name === 'endDate') {
      date = this.state.endDate;
      if(date === null) {
        date = this.props.info.selectInfo?.end;
      }
    }

    return date;
  }

  getAllDay(){
    let allDay = this.state.allDay;
    if(allDay === undefined) {
      allDay = this.props.info.selectInfo?.allDay;
    }

    return allDay;
  }
  
  render() {
    let selectInfo = this.props.info.selectInfo;
    let x = selectInfo?.jsEvent?.clientX ?? 200;
    let y = selectInfo?.jsEvent?.clientY ?? 200;

    let startDate = this.getDate('startDate') ?? new Date();
    let endDate = this.getDate('endDate') ?? new Date();
    let allDay = this.getAllDay() ?? false;
    
    return(
      <Popover
        id="event-creation"
        anchorReference="anchorPosition"
        anchorPosition={{top: y, left: x}}
        keepMounted
        open={this.props.info.openMenu}
        onClose={this.props.onClickAway}
      >
      <Paper>
      <div className="root">
        <Typography variant="h6" gutterBottom>
          Create event -
        </Typography>
        <Grid container spacing={3} justify='center'>
          <Grid item xs={12}>
            <TextField
              name="title"
              label="Title"
              value={this.state.title}
              onChange={this.handleEventMenuChanged}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="description"
              label="Description"
              multiline
              rows={2}
              value={this.state.description}
              onChange={this.handleEventMenuChanged}
            />
          </Grid>
          <Grid item container xs={12} spacing={0} alignItems="flex-end">
            <Grid item xs={3}>
              <Typography variant="body1" gutterBottom>
                All day:
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Checkbox checked={allDay} onChange={() => { this.setState({ allDay: !this.getAllDay() }) }} />
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="startDate"
              label="Start Date"
              type="date"
              value={getDateStr(startDate)}
              onChange={this.handleDateChanged}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="startDate"
              label="Start Time"
              type="time"
              value={getTimeStr(startDate)}
              onChange={this.handleTimeChanged}
            />
          </Grid>
          {!allDay &&
          <Grid item xs={6}>
            <TextField
              name="endDate"
              label="End Date"
              type="date"
              value={getDateStr(endDate)}
              onChange={this.handleDateChanged}
            />
          </Grid>
          }
          {!allDay &&
          <Grid item xs={6}>
            <TextField
              name="endDate"
              label="End Time"
              type="time"
              value={getTimeStr(endDate)}
              onChange={this.handleTimeChanged}
            />
          </Grid>
          }
          <Grid item container xs={12} spacing={2} alignItems="flex-end">
            <Grid item xs={4}>
              <Typography variant="body1" gutterBottom>
                Repeats:
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Select
                name="recurrence"
                value={this.state.recurrence}
                onChange={this.handleEventMenuChanged}
              >
                <MenuItem value="never">Never</MenuItem>
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly on {getWeekAndDayStr(startDate)}</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </Grid>
        <div className="buttons">
          <Button onClick={() => {this.resetDefaultState(selectInfo?.view?.calendar); this.props.onClickAway()}}>
            Cancel
          </Button>
          <Button color="primary" onClick={() => this.handleEventCreate(this.props.info.selectInfo)}>
            Save
          </Button>
        </div>
      </div>
      </Paper>
      </Popover>
    )
  }
}
