import React from 'react'
import { useState } from 'react'
import { useQuery } from '@apollo/client';
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
import FilterBar from './filters';
import { GET_RESOURCE } from './queries';

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    root: {
      flexGrow: 345,
    },
    close: {
      marginLeft: 'auto'
    },
    resourceContainer: {
      display: 'flex',
      flexDirection: 'row',
      marginTop: 60,
    },
    sidebar: {
      backgroundColor: 'blue',
      flexGrow: 1,
      marginRight: 50,
    },
    searchResults: {
      flexGrow: 8,
    },
    resource: {
      marginBottom: 20,
    }
  })
);

interface ResourceProps {
  title: string,
  description: string,
  date: Date
}

export interface ResourcesProps {
  resourceID: string[]
}

export default function Resources(props: ResourcesProps) {
  return(
          <div />
            /*
      props.resourceID.map((id) => {
        <Resource
          
        />
      });
             */
  );
}

function Resource(props: ResourceProps) {
  const classes = useStyles();

  return(
    <Card className={classes.resource}>
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
        title={props.title}
        subheader={getFormattedDateStr(props.date)}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {props.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <IconButton
          aria-label="edit"
          onClick={() => {}}>
          <EditIcon />
        </IconButton>
        <IconButton
          aria-label="delete"
          onClick={() => {}}>
          <DeleteIcon />
        </IconButton>
        <Button className={classes.close} onClick={() => {}}>
          Close
        </Button>
      </CardActions>
    </Card>
  )
}
