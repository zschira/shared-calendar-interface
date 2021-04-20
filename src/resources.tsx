import React from 'react'
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

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    close: {
      marginLeft: 'auto'
    },
    resource: {
      marginBottom: 20,
    }
  })
);

export interface Resource {
  _id: string,
  title: string,
  description: string,
  tags: string[]
}

export interface ResourcesProps {
  resources: Resource[]
}

export default function Resources(props: ResourcesProps) {
  let resourceArray = props.resources.map((resource) => {
    return (
      <ResourceResult
        {...resource}
        key={resource._id}
      />
    )
  });

  return(
    <div>
    {resourceArray}
    </div>
  );
}

function ResourceResult(props: Resource) {
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
