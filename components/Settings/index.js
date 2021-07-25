import { Badge, Checkbox, Container, FormControlLabel, Grid, IconButton, Input, InputLabel, makeStyles, MenuItem, Select, Slider, TextField, Typography } from "@material-ui/core";
import DrawerHeading from "../DrawerHeading";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { auth, firestore } from "../../lib/firebase";
import Form from "../Form";
import EmailIcon from '@material-ui/icons/Email';
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { UserContext } from "../../lib/context";

export default function Settings(props) {
    const { emailNotification } = useContext(UserContext);

    const notificationRef = firestore.collection('users').doc(auth.currentUser.uid).collection('notifications').doc('email');
    return (
        <main>
            <Container maxWidth="md">
                <DrawerHeading heading="Settings" />
                <NotificationSettings defaultValues={emailNotification ? emailNotification : notificationDummy} notificationRef={notificationRef}></NotificationSettings>
                <Grid container spacing={1} direction="row" justifyContent="flex-end" alignItems="flex-end"> 
                <IconButton onClick={() => auth.signOut()}>
                    <ExitToAppIcon />
                </IconButton>
                </Grid>
            </Container>
        </main>
    )
}

const notificationDummy = {
    email: '',
    notify: false,
    daysBefore: 7
}

function NotificationSettings({ defaultValues, notificationRef }) {
    // const { register, handleSubmit, reset, watch, formState } = useForm({ defaultValues, mode: 'onChange' });
    const [email, setEmail] = useState(defaultValues.email)
    const [notify, setNotify] = useState(defaultValues.notify)
    const [daysBefore, setDaysBefore] = useState(defaultValues.daysBefore)

    const handleCheckboxChange = (e) => {
        setNotify(e.target.checked);
        updateNotification({...defaultValues, notify: e.target.checked});
    }

    const handleTextFieldChange = (e) => {
        setEmail(e.target.value);
        updateNotification({...defaultValues, email: e.target.value});
    }

    const handleSliderChange = (e, newValue) => {
        const targetValue = typeof newValue == 'number' ? newValue : 0
        setDaysBefore(targetValue);
        updateNotification({...defaultValues, daysBefore: targetValue });
    }
    const handleInputChange = (event) => {
        const targetValue = typeof event.target.value == 'number' ? event.target.value : 0
        setDaysBefore(targetValue);
        updateNotification({...defaultValues, daysBefore: targetValue});
      };

    const updateNotification = async ({ email, notify, daysBefore }) => {
        await notificationRef.set({
            email,
            notify,
            daysBefore
        });
    }
    return (
        <Form submit={false}>
            <TextField id="email" label="E-Mail" fullWidth defaultValue={defaultValues.email} onBlur={() => updateNotification({ email, notify, daysBefore })} inputProps={{ onChange: handleTextFieldChange}}  />
            <InputLabel shrink id="birthday-reminders">Receive Birthday Reminders</InputLabel>
            <FormControlLabel
                id="notify"
                value="start"
                control={<Checkbox color="primary" checked={defaultValues.notify} onClick={handleCheckboxChange} />}
                label="via E-Mail"
                labelPlacement="start"
                />
            <InputLabel shrink id="notifications">Notify Days Before</InputLabel>
            <Grid container spacing={2} alignItems="center" id="days-before">
                <Grid item>
                <IconButton disabled={!notify}>
                    <Badge showZero={true} variant="dot" overlap="circular" color={!notify ? "default" : "primary"}>
                        <EmailIcon />
                    </Badge>
                </IconButton>
                </Grid>
                <Grid item xs>
                <Slider
                    value={daysBefore}
                    step={1}
                    min={0}
                    max={14}
                    onChange={handleSliderChange}
                    aria-labelledby="input-slider"
                    disabled={!notify}
                />
                </Grid>
                <Grid item>
                <Input
                    // className={classes.input}
                    value={daysBefore}
                    margin="dense"
                    onChange={handleInputChange}
                    // onBlur={handleBlur}
                    inputProps={{
                    step: 10,
                    min: 0,
                    max: 100,
                    type: 'number',
                    'aria-labelledby': 'input-slider',
                    }}
                    disabled={!notify}
                />
                </Grid>
            </Grid>
            {/* <Select
            // labelId="demo-simple-select-label"
            // id="demo-simple-select"
            // value={age}
            // onChange={handleChange}
            fullWidth
            >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={6}>6</MenuItem>
                <MenuItem value={7}>7</MenuItem>
            </Select> */}
        </Form>
    )
}