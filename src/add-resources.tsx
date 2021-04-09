import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { ADD_RESOURCE } from './mutations';
import { createHashId } from './event-utils'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      marginTop: theme.spacing(10),
      justifyContent: 'center',
    },
    form: {
      display: 'flex',
      //alignItems: 'center',
      flexDirection: 'column',
      width: '45%',
      height: '600px',
      justifyContent: 'space-between',
      padding: theme.spacing(2)
    },
    title: {
      marginRight: 'auto'
    },
    titleInput: {
      marginRight: theme.spacing(1),
      width: '50ch',
    },
    typeInput: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: '15ch',
    },
    descriptionInput: {
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(2),
      width: '67ch',
    },
    buttons: {
      marginLeft: 'auto',
      marginTop: theme.spacing(2),
    },
  }),
);

type ChangeEvent = React.ChangeEvent<{ name?: string | undefined; value: unknown; }>;

interface ParamsType {
  eventId: string,
}

interface Resource {
  _id: string,
  title: string,
  description: string,
  providing: boolean,
  tags: string[],
  event: string
}

export default function ResourceForm() {
  const classes = useStyles();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [resourceType, setResourceType] = useState('provide');
  const [tags, setTags] = useState('');
  const { eventId } = useParams<ParamsType>();

  const [addResource] = useMutation<
    {addResource: string},
    {location: string, newResource: Resource}
  >(ADD_RESOURCE);

  const handleFormChanged = (event: ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    const name = target.name;

    switch (name) {
      case "title":
        setTitle(value);
        break;
      case "description":
        setDescription(value);
        break;
      case "type":
        setResourceType(value);
        break;
      case "tags":
        setTags(value);
        break;
    }
  }

  const handleAdd = () => {
    let tagArray = tags.split(',').map((tag) => tag.trim());

    addResource({ variables: {
        location: "Washington, D.C.",
        newResource: {
          _id: createHashId([title, description, resourceType].concat(tagArray)),
          title: title,
          description: description,
          providing: resourceType === 'providing',
          tags: tagArray,
          event: eventId,
        }
      }
    });
  }

        /*
  const handleFormChanged = (event: ChangeEvent) => {
    const value = (event.target as HTMLInputElement).value;

    setTags(value.split(',').map((tag) => tag.trim()));
  }*/

  return(
    <div className={classes.root}>
      <Paper className={classes.form}>
        <Typography variant="h4" component="h2" className={classes.title}>
          Attach New Resource
        </Typography>
        <div>
          <TextField
            label="Title"
            name="title"
            className={classes.titleInput}
            value={title}
            onChange={handleFormChanged}
          />
          <FormControl className={classes.typeInput} >
            <InputLabel>Type</InputLabel>
            <Select
              value={resourceType}
              name="type"
              onChange={handleFormChanged}
            >
              <MenuItem value="provide">Provide</MenuItem>
              <MenuItem value="request">Request</MenuItem>
            </Select>
          </FormControl>
        </div>
        <TextField
          label="Description"
          name="description"
          className={classes.descriptionInput} 
          value={description}
          onChange={handleFormChanged}
          multiline
          rows={3}
        />
        <TextField
          name="tags"
          className={classes.descriptionInput}
          label="Tags (e.g. clothes, winter gear)"
          value={tags}
          onChange={handleFormChanged}
        />
        <div className={classes.buttons}>
          <Button component={Link} to={"/"}>
            Cancel
          </Button>
          <Button
            color="primary"
            component={Link}
            to={"/"}
            onClick={handleAdd}
          >
            Save
          </Button>
        </div>
      </Paper>
    </div>
  );
}
