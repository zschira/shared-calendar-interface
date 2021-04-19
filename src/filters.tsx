import React from 'react'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    sidebar: {
      flexGrow: 0.5,
      marginRight: 20,
    },
    paper: {
      padding: 10,
      display: 'flex',
      flexDirection: 'column',
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      flexGrow: 1.5,
    },
    rowContent: {
      flexGrow: 1.5,
    },
    test: {
      margin: theme.spacing(2, 0, 2),
    }
  })
);

export interface FilterProps {
  tags: Map<string, boolean>,
  setQueryTags: (arg0: string) => void,
  setRangeStartStr: (arg0: string) => void,
  setRangeEndStr: (arg0: string) => void,
  rangeStartStr: string,
  rangeEndStr: string,
}

type ChangeEvent = React.ChangeEvent<{ name?: string | undefined; value: unknown; }>;

export default function FilterBar(props: FilterProps) {
  const classes = useStyles();

  const handleChange = (tag: string) => {
    props.setQueryTags(tag);
  }

  const tagCheckBoxes = Array.from(props.tags.keys()).map((tag: string) =>
      <FormControlLabel
        control={<Checkbox 
                  checked={props.tags.get(tag)} 
                  onChange={() => handleChange(tag)} 
                  name={tag} />}
        label={tag}
        key={tag}
      />
  );

  const handleDateChanged = (event: ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    const name = target.name;

    if(name === 'rangeStartStr') {
      props.setRangeStartStr(target.value);
    } else {
      props.setRangeEndStr(target.value);
    }
  }

  return (
    <div className={classes.sidebar}>
      <div className={classes.paper}>
        <h2>Filters</h2>
        <FormControl component="fieldset" className={classes.row}>
          <FormLabel component="legend">Date Range</FormLabel>
          <div className={classes.rowContent}>
            <TextField
              name="rangeStartStr"
              label="Start Date"
              type="date"
              value={props.rangeStartStr}
              onChange={handleDateChanged}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
          <div className={classes.rowContent}>
            <TextField
              name="rangeEndStr"
              label="End Date"
              className={classes.rowContent}
              type="date"
              value={props.rangeEndStr}
              onChange={handleDateChanged}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
        </FormControl>
        <Divider className={classes.test} />
        <FormControl component="fieldset" className={classes.row}>
          <FormLabel component="legend">Tags</FormLabel>
          <FormGroup>
            {tagCheckBoxes}
          </FormGroup>
        </FormControl>
        <div className={classes.row}>
        </div>
      </div>
    </div>
  );
}
