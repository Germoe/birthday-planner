import { Badge, Button, Drawer, Fab, FormControlLabel, Grid, Icon, IconButton, makeStyles, styled, SvgIcon, Switch, Typography } from "@material-ui/core";
import React, { useContext, useState } from "react";
import { UserContext } from "../../lib/context";
import { auth, firestore } from "../../lib/firebase";
import BirthdayList from "../BirthdayList";
import CreatePage from "../Create";
import EditPage from "../Edit";
import Loader from "../Loader";
import AddIcon from '@material-ui/icons/Add';
import SortByAlphaIcon from '@material-ui/icons/SortByAlpha';
import RefreshIcon from '@material-ui/icons/Refresh';
import SettingsIcon from '@material-ui/icons/Settings';
import ErrorIcon from '@material-ui/icons/Error';
import { useTheme, withStyles } from '@material-ui/core/styles';
import Settings from "../Settings";
import { getDate, getMonth } from "../../lib/utils";

const ErrorBadge = withStyles((theme) => ({
    badge: {
      right: 0,
      top: 5,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: '0 4px',
    },
  }))(Badge);

const useStyles = makeStyles(theme => ({
    fabGroup: {
      position: 'fixed',
      bottom: theme.spacing(3),
      right: theme.spacing(3),
      '& button': {
          marginTop: theme.spacing(3)
      }
    },
    alarmButton: {
        marginRight: '5px',
    },
    bottomDrawer: {
        maxHeight: '80%',
        [theme.breakpoints.down("sm")]: {
            margin: '0',
        },
        [theme.breakpoints.up("md")]: {
            maxWidth: theme.breakpoints.values["md"],
            margin: 'auto'
        },
    },
    alignCenter: {
        textAlign: 'center',
    },
    alignRight: {
        textAlign: 'right',
    }
  }));

function FabGroup(props) {
    const classes = useStyles();
    return (
        <Grid container direction="column" justifyContent="center" alignItems="flex-end" className={classes.fabGroup}>
            {props.children}
        </Grid>
    )
}
  
  
function IconGroup(props) {
    const theme = useTheme();
    return (
        <div>
            {props.children}
        </div>
    );
}

export default function Controls(props) {
    const [isCreate, setIsCreate] = useState(false);
    const [editId, setEditId] = useState('');
    const isEdit = editId.length > 0

    const [sortBy, setSortBy] = useState(['daysUntil']);

    const [validBirthdays, setValidBirthdays] = useState(false)
    const [birthdays, setBirthdays] = useState([]);
    const [loading, setLoading] = useState(false);

    const { user, emailNotification, loadNotifications } = useContext(UserContext);

    // Only Fetch Birthdays Once on Log In
    if ((user && !validBirthdays)) {
        const getBirthdays = async () => {
            // Initial Load of Birthdays
            setLoading(true)

            const usersRef = firestore.doc(`users/${auth.currentUser.uid}`);
            const resBirthdays = (await usersRef.collection('birthdays').get()).docs.map((doc) => {
                return { 
                    id:doc.id, 
                    data: doc.data() 
                }
            });

            // Enrich result data
            const newBirthdays = resBirthdays.map(({ id, data }) => {
                const daysUntil = getCountDown(data.birthdate.toDate())
                return {
                    id,
                    data: {
                        ...data,
                        daysUntil
                    }
                }
            })
            
            setBirthdays(newBirthdays)
            setLoading(false)
        }

        getBirthdays()
        setValidBirthdays(true)
    }   

    const closeDrawer = () => {
        setIsCreate(false);
        setEditId('');

    }
    
    const [drawer, setDrawer] = useState(false)
    const [settings, setSettings] = useState(false)
    const toggleDrawer = (bool) => {
        setDrawer(bool)
    }

    const toggleSort = () => {
        if (sortBy == 'Alphabet') {
            setSortBy('daysUntil')
        } else {
            setSortBy('Alphabet')
        }
    }
    const classes = useStyles();

    return (
        <>
        <Grid container spacing={1} direction="row" justifyContent="center" alignItems="flex-start"> 
                {props.children}
        </Grid>
        <Grid container spacing={2} direction="row" justifyContent="center" alignItems="center"> 
            <Grid item xs={3}>
                    <IconButton onClick={() => setSettings(true)} size="small" aria-label="settings">
                        {(!emailNotification & !loadNotifications) ? 
                            <ErrorBadge badgeContent={'!'} overlap="circular" color="secondary">
                                <SettingsIcon />
                            </ErrorBadge> : <SettingsIcon />}
                    </IconButton>
            </Grid>
            <Grid item xs={6} className={classes.alignCenter}>
                <Typography variant="h6" component="h1">Birthdays</Typography>
            </Grid>
            <Grid item xs={3} className={classes.alignRight}>
            </Grid>
            <Grid item xs={12}>
                <BirthdayList birthdays={birthdays} setEditId={setEditId} sortBy={sortBy} />
            </Grid>
            <Loader show={loading} />
            
            <FabGroup>
                <Fab color="primary" aria-label="add" onClick={() => setIsCreate(true)}>
                    <AddIcon />
                </Fab>
            </FabGroup>
            <Drawer anchor="bottom"  open={isCreate || isEdit} onClose={() => closeDrawer()} PaperProps={{ square: true, elevation: 10, className: classes.bottomDrawer }}>
                {editId && <EditPage setValidBirthdays={setValidBirthdays} setEditId={setEditId} id={editId} />}
                {isCreate && <CreatePage setValidBirthdays={setValidBirthdays} setIsCreate={setIsCreate} />}
            </Drawer>
            <Drawer anchor="top"  open={settings} onClose={() => setSettings(false)} PaperProps={{ square: true, elevation: 10 }}>
                <Settings />
            </Drawer>
        </Grid>
        </>
    )
}

function getCountDown(birthdate) {
    const today = new Date();
    let next_date = new Date(`${today.getFullYear()}-${getMonth(birthdate)}-${getDate(birthdate)}`);
    if (today > next_date) {
        next_date = new Date(`${today.getFullYear() + 1}-${getMonth(birthdate)}-${getDate(birthdate)}`);
    }
    const timeinmilisec = next_date.getTime() - today.getTime();
    return Math.ceil(timeinmilisec / (1000 * 60 * 60 * 24));
}