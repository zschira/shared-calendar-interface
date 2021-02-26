import React from 'react'
import Popover from '@material-ui/core/Popover';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ShareIcon from '@material-ui/icons/Share';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { getFormattedDateStr } from './date-utils';
import { EventClickArg } from '@fullcalendar/react'

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    root: {
      flexGrow: 345,
    },
    close: {
      marginLeft: 'auto'
    }
  })
);

export interface EventClickInfo {
  openMenu: boolean,
  clickInfo: EventClickArg | null
}

export interface EventClickProps {
  eventClick: EventClickInfo,
  onClickAway: () => void,
}

export default function EventClick(props: EventClickProps) {
  const classes = useStyles();
  let clickInfo = props.eventClick.clickInfo;
  let x = clickInfo?.jsEvent?.clientX ?? 200;
  let y = clickInfo?.jsEvent?.clientY ?? 200;
  let startStr = getFormattedDateStr(clickInfo?.event?.start);
  let endStr = getFormattedDateStr(clickInfo?.event?.end);

  return(
    <Popover
      id="event-creation"
      anchorReference="anchorPosition"
      anchorPosition={{top: y, left: x}}
      keepMounted
      open={props.eventClick.openMenu}
      onClose={props.onClickAway}
    >
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe">
            OP
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={clickInfo?.event?.title}
        subheader={`${startStr} - ${endStr}`}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {clickInfo?.event?.extendedProps?.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <IconButton aria-label="edit">
          <EditIcon />
        </IconButton>
        <IconButton aria-label="delete" onClick={() => {clickInfo?.event?.remove(); props.onClickAway();}}>
          <DeleteIcon />
        </IconButton>
        <Button className={classes.close} onClick={() => {props.onClickAway()}}>
          Close
        </Button>
      </CardActions>
    </Card>
    </Popover>
  )
}
