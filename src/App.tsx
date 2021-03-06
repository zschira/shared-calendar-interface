import React from 'react';
import clsx from 'clsx';
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
import Calendar from './calendar';

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
      padding: theme.spacing(3),
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
  }),
);

export default function BaseApplication() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [view, setView] = React.useState("calendar");
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

  const handleViewSelect = (name: string) => {
    setView(name);
    setOpen(false);
  }

  const handleGetTitle = (title: string) => {
    setTitle(title);
  }

  const handleCalendarViewSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCalendarView(event.target.value as string);
  }

  const getAppBarContent = () => {
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
    } else if(view === "resourceManagement") {
    }
  }

  return (
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
          {getAppBarContent()}
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
          <ListItem button onClick={() => { handleViewSelect("calendar") }}>
            <ListItemIcon> <TodayIcon /> </ListItemIcon>
            <ListItemText primary="Calendar" />
          </ListItem>
          <ListItem button onClick={() => { handleViewSelect("resourceManagement") }}>
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
      {view === "calendar" &&
        <Calendar 
          prevCalled={prev}
          nextCalled={next}
          todayCalled={today}
          setTitle={handleGetTitle}
          calendarView={calendarView}
          drawerOpen={open}
        />
      }
      {view === "resourceManagement" && <div />}
      </main>
    </div>
  );
}
