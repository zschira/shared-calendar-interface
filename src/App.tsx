import React from 'react';
import clsx from 'clsx';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import TodayIcon from '@material-ui/icons/Today';
import PeopleIcon from '@material-ui/icons/People';
import Select from '@material-ui/core/Select';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import Content from './content';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      height: 100,
    },
    main: {
    },
    appBar: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    selectBox: {
      backgroundColor: "white",
      marginRight: theme.spacing(3),
    },
    appBarContent: {
      display: 'flex',
      flexDirection: 'row',
      flexGrow: 1,
      paddingLeft: theme.spacing(2),
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(1),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: 0,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: 0,
      }),
      marginLeft: 0,
    },
    resource: {
      width: '50%',
      margin: '0 auto',
      marginTop: 50,
    },
    scroll: {
      display: 'flex',
      flexDirection: 'column',
    }
  }),
);

export default function BaseApplication() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [prev, setPrev] = React.useState(0);
  const [next, setNext] = React.useState(0);
  const [today, setToday] = React.useState(0);
  const [title, setTitle] = React.useState("");
  const [calendarView, setCalendarView] = React.useState("month");

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleCalendarViewSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCalendarView(event.target.value as string);
  }

  const getAppBarContent = (view: string) => {
    if(view === "calendar") {
      return(
        <>
          <Typography variant="h6">
            Mutual Aid Hub
          </Typography>
          <div className={classes.appBarContent}>
            <IconButton color="inherit" edge="end" onClick={() => { setPrev(prev+1); }}>
              <ChevronLeftIcon />
            </IconButton>
            <IconButton color="inherit" edge="end" onClick={() => { setNext(next+1); }}>
              <ChevronRightIcon />
            </IconButton>
            <Button color="inherit" onClick={() => { setToday(today+1); }}> 
              Today 
            </Button>
          </div>
          <Typography variant="h6" className={classes.title}>
            {title}
          </Typography>
          <div>
            <Select
              value={calendarView}
              onChange={handleCalendarViewSelect}
              className={classes.selectBox}
              native
              variant="outlined"
            >
              <option value={"month"}>Month</option>
              <option value={"week"}>Week</option>
              <option value={"day"}>Day</option>
            </Select>
            <IconButton color="inherit" edge="end" >
              <AccountCircleIcon fontSize="large"/>
            </IconButton>
          </div>
        </>
      );
    } else if(view === "resources") {
      return(
        <>
          <Typography variant="h6" className={classes.title}>
            Mutual Aid Hub
          </Typography>
          <div>
            <IconButton color="inherit" edge="end" >
              <AccountCircleIcon fontSize="large"/>
            </IconButton>
          </div>
        </>
      );
    }
  }

  return (
    <Router>
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Switch>
            <Route path="/resources">
              {getAppBarContent("resources")}
            </Route>
            <Route path="/">
              {getAppBarContent("calendar")}
            </Route>
          </Switch>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button onClick={handleDrawerClose} component={Link} to={"/"}>
            <ListItemIcon> <TodayIcon /> </ListItemIcon>
            <ListItemText primary="Calendar" />
          </ListItem>
          <ListItem button onClick={handleDrawerClose} component={Link} to={"/resources"}>
            <ListItemIcon> <PeopleIcon /> </ListItemIcon>
            <ListItemText primary="Resource Management" />
          </ListItem>
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <Content
          prevCalled={prev}
          nextCalled={next}
          todayCalled={today}
          setTitle={setTitle}
          calendarView={calendarView}
          drawerOpen={open}
        />
      </main>
    </div>
    </Router>
  );
}
