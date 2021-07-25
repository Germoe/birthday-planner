import { useRouter } from 'next/dist/client/router';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import Home from '.';
import { auth, googleAuthProvider } from '../lib/firebase';
import validator from 'validator'
import { Box, Button, Grid, makeStyles, Snackbar, TextField, Typography } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import toast from 'react-hot-toast';

const useStyles = makeStyles(theme => ({
    loginHeading: {
      paddingTop: theme.spacing(3),
    },
  }));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function SignInPage(props) {
    const [user, loading] = useAuthState(auth);
    const router = useRouter(); // Router Initialization to prepare for imperative navigation if not logged in
    
    const classes = useStyles();
    const [signIn, setSignIn] = useState(true);

    useEffect(() => {
        if (user) {
          router.push('/')
        }
    }, [user, loading])
    
    return (
        <>
            <Grid item xs={12}>
                <Home />
            </Grid>
            <Grid item xs={6}>
                <a onClick={() => setSignIn(true)}>{signIn ? <u>Log In</u> : `Log In`}</a>
            </Grid>
            <Grid item xs={6}>
                <a onClick={() => setSignIn(false)}>{!signIn ? <u>Sign Up</u> : `Sign Up`}</a>
            </Grid>
            <Grid item xs={12} className={classes.loginHeading}>
                {user ? <Typography variant="h3" component="h1" gutterBottom>Welcome Back, <strong>{user.displayName}</strong></Typography> : <Typography variant="h3" component="h1" gutterBottom>Hello <strong>Beautiful</strong></Typography>}
            </Grid>
            <Grid item xs={12}>
                <PasswordSignIn signIn={signIn} />
            </Grid>
        </>
    )
}

// Sign In with Email and Password
function PasswordSignIn(props) {
    const [email, setEmail] = useState(""); // Required
    const [password, setPassword] = useState(""); // Required
    const [repeatPassword, setRepeatPassword] = useState(""); // Required if Signup

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [emailError, setEmailError] = useState(false);
    const [validPassError, setValidPassError] = useState(false);
    const [equalPassError, setEqualPassError] = useState(false);

    // TODO Add Try and Catch Block 
    const onSubmit = async (e) => {
    e.preventDefault();
    
    if (props.signIn) {
        await auth.signInWithEmailAndPassword(email, password) 
            .then((userCredential) => {})
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                setError(true);
                setErrorMessage(errorMessage);
            });
    } else {
        await auth.createUserWithEmailAndPassword(email, password) 
            .then((userCredential) => {})
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                setError(true);
                setErrorMessage(errorMessage);
            });
    }
    }

    let isValid;
    if (props.signIn) {
        isValid = validateEmail(email) && validatePassword(password);
    } else {
        isValid = validateEmail(email) && validatePassword(password) && validator.equals(password,repeatPassword);
    }
    
    return (
        <>
        <Snackbar open={error} autoHideDuration={6000} onClose={() => setError(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <Alert onClose={() => setError(false)} severity="error">
            {errorMessage}
            </Alert>
        </Snackbar>
        <Box
        display="flex"
        alignItems="center"
        p={1}
        m={1}
        bgcolor="background.paper"
        sx={{ height: 400 }}
      >
            <form onSubmit={onSubmit}>
            <div className="row">
                <TextField id="filled-basic" 
                    label="E-Mail" 
                    variant="filled"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    helperText="please enter valid e-mail"
                    fullWidth
                    required />
            </div>
            <div className="row">
                <TextField id="filled-basic" 
                    label="Password" 
                    variant="filled"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    helperText="must be at least 8 characters"
                    fullWidth
                    required />
            </div>
            <div className="row">
                {!props.signIn && (
                    <TextField id="filled-basic" 
                    label="Repeat Password" 
                    variant="filled"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    type="password"
                    helperText="passwords must be the same"
                    fullWidth
                    required />
                )}
            </div>
            <div className="row">
                <GoogleSignInButton />
            </div>
            <div className="row">
            <Button type="submit" disabled={!isValid} variant="contained" color="primary">
                {props.signIn ? `Log In` : `Sign Up`}
            </Button>
            </div>
            </form>
        </Box>
        </>
    );
}

function validateEmail(email) {
    return validator.isEmail(email);
}

function validatePassword(password) {
    return validator.isStrongPassword(password, { minLength: 8, 
        minLowercase: 0, 
        minUppercase: 0, 
        minNumbers: 0, 
        minSymbols: 0, 
        returnScore: false
    })
}

// Sign In with Google Button
function GoogleSignInButton() {
    // TODO Add Try and Catch Block 
    const signInWithGoogle = async (signInWithEmailAndPassword) => {
        await auth.signInWithPopup(googleAuthProvider)
            .then((userCredential) => {})
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode)
                console.log(errorMessage)
            });;
    }

    return (
        <div className="google-login-btn" onClick={signInWithGoogle}>
            <Image src={"/google.png"} alt='Sign In with Google' layout="fixed" height={25} width={25} />
        </div>
    )
}