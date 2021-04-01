import React from 'react'
import { useState, useEffect } from 'react'
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
  tags: string[],
  setRangeStartStr: (arg0: string) => void,
  setRangeEndStr: (arg0: string) => void,
  rangeStartStr: string,
  rangeEndStr: string,
}

interface TagChecks {
  [key: string]: boolean
};

type ChangeEvent = React.ChangeEvent<{ name?: string | undefined; value: unknown; }>;

export default function FilterBar(props: FilterProps) {
  const classes = useStyles();

  const [tagChecks, setTagChecks] = useState<TagChecks>({});
  const [updateCounter, setUpdateCounter] = useState(0);

  useEffect(() => {
    setTagChecks({});
    props.tags.forEach((tag) => {
      setTagChecks((tags) => {
        tags[tag] = false;
        return tags;
      });
    });
  }, [props.tags]);

  const handleChange = (tag: string) => {
    setTagChecks((tags) => {
      tags[tag] = !tags[tag];
      return tags;
    });

    setUpdateCounter(updateCounter + 1);
  }

  const tagCheckBoxes = props.tags.map((tag: string) =>
      <FormControlLabel
        control={<Checkbox 
                  checked={tagChecks[tag] || false} 
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
