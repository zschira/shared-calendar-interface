import React from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

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

interface ResourceProps {
  title: string,
  description: string,
  tags: string[],
  date: Date | null,
}

export default function Resource(props: ResourceProps) {
  const classes = useStyles();
}
