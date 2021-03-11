import React from 'react'
import { useState, useEffect} from 'react'
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

type ChangeEvent = React.ChangeEvent<{ name?: string | undefined; value: unknown; }>;

export default function EventMenu(props: EventMenuProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [allDay, setAllDay] = useState(false);
  const [recurrence, setRecurrence] = useState('never');
  const [horizontal, setHorizontal] = useState(200);
  const [vertical, setVertical] = useState(200);

  useEffect(() => {
    setStartDate(props.info.selectInfo?.start ?? new Date());
    setEndDate(props.info.selectInfo?.end ?? new Date());
    setAllDay(props.info.selectInfo?.allDay ?? false);
    setHorizontal(props.info.selectInfo?.jsEvent?.clientX ?? 200);
    setVertical(props.info.selectInfo?.jsEvent?.clientY ?? 200);
  }, [props.info.selectInfo]);

  useEffect(() => {
    setTitle('');
    setDescription('');
    setRecurrence('');
  }, [props.info.selectInfo]);

  const handleEventMenuChanged = (event: ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    const name = target.name;

    switch (name) {
      case 'title':
        setTitle(value);
        break;
      case 'description':
        setDescription(value);
        break;
      case 'recurrence':
        setRecurrence(value);
        break;
    }
  }

  const handleEventCreate = (selectInfo: DateSelectArg | null) => {
    if(selectInfo === null) {
      return;
    }

    let calendarApi = selectInfo.view.calendar;

    if(recurrence === 'never') {
        createNormalEvent(calendarApi);
    } else {
        createRecurringEvent(calendarApi);
    }

    calendarApi.unselect();
  }

  const createNormalEvent = (calendarApi: CalendarApi) => {
    calendarApi.addEvent({
      id: createEventId(),
      title: title,
      extendedProps: {
        description: description,
      },
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      allDay: allDay
    });
  }

  const createRecurringEvent = (calendarApi: CalendarApi) => {
    let byWeekDay = null;
    if(recurrence === 'monthly') {
      byWeekDay = getWeekDayRule(startDate.getDay(), getWeekOfMonth(startDate, true));
    }

    calendarApi.addEvent({
      id: createEventId(),
      title: title,
      extendedProps: {
        description: description,
      },
      rrule: {
        freq: recurrence,
        dtstart: startDate.toISOString(),
        byweekday: byWeekDay
      },
      duration: endDate.getTime() - startDate.getTime()
    });
  }
  
  const handleDateChanged = (event: ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    const value = target.value.split('-');
    const name = target.name;

    let date = name === 'startDate' ? startDate : endDate;
    date.setFullYear(parseInt(value[0]));
    date.setMonth(parseInt(value[1]) - 1);
    date.setDate(parseInt(value[2]));

    name === 'startDate' ? setStartDate(date) : setEndDate(date);
  }

  const handleTimeChanged = (event: ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    const value = target.value.split(':');
    const name = target.name;

    let date = name === 'startDate' ? startDate : endDate;
    date.setHours(parseInt(value[0]));
    date.setMinutes(parseInt(value[1]));

    name === 'startDate' ? setStartDate(date) : setEndDate(date);
  }
  
  return(
    <Popover
      id="event-creation"
      anchorReference="anchorPosition"
      anchorPosition={{top: vertical, left: horizontal}}
      keepMounted
      open={props.info.openMenu}
      onClose={props.onClickAway}
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
            value={title}
            onChange={handleEventMenuChanged}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="description"
            label="Description"
            multiline
            rows={2}
            value={description}
            onChange={handleEventMenuChanged}
          />
        </Grid>
        <Grid item container xs={12} spacing={0} alignItems="flex-end">
          <Grid item xs={3}>
            <Typography variant="body1" gutterBottom>
              All day:
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <Checkbox
              checked={allDay} 
              onChange={() => { setAllDay(!allDay) }} 
            />
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <TextField
            name="startDate"
            label="Start Date"
            type="date"
            value={getDateStr(startDate)}
            onChange={handleDateChanged}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            name="startDate"
            label="Start Time"
            type="time"
            value={getTimeStr(startDate)}
            onChange={handleTimeChanged}
          />
        </Grid>
        {!allDay &&
        <Grid item xs={6}>
          <TextField
            name="endDate"
            label="End Date"
            type="date"
            value={getDateStr(endDate)}
            onChange={handleDateChanged}
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
            onChange={handleTimeChanged}
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
              value={recurrence}
              onChange={handleEventMenuChanged}
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
        <Button onClick={() => {props.onClickAway()}}>
          Cancel
        </Button>
        <Button 
          color="primary" 
          onClick={() => handleEventCreate(props.info.selectInfo)}
        >
          Save
        </Button>
      </div>
    </div>
    </Paper>
    </Popover>
  )
}
