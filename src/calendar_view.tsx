import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { useState } from 'react'

import Calendar, { CalendarProps } from './calendar'
import FilterBar from './filters'

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

export default function CalendarView(props: CalendarProps) {
  const classes = useStyles();

  const [rangeStartStr, setRangeStartStr] = useState('');
  const [rangeEndStr, setRangeEndStr] = useState('');

  return(
    <div className={classes.resourceContainer}>
      <FilterBar 
        tags={['Clothing', 'Toiletries', 'Shelter']}
        setRangeStartStr={setRangeStartStr}
        setRangeEndStr={setRangeEndStr}
        rangeStartStr={rangeStartStr}
        rangeEndStr={rangeEndStr}
      />
      <div className={classes.calendar}>
        <Calendar
          prevCalled={props.prevCalled}
          nextCalled={props.nextCalled}
          todayCalled={props.todayCalled}
          setTitle={props.setTitle}
          calendarView={props.calendarView}
          drawerOpen={props.drawerOpen}
          filters={{
            startStr: rangeStartStr,
            endStr: rangeEndStr,
            tags: []
          }}
        />
      </div>
    </div>
  );
}
