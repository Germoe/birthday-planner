import BirthdayList from '../components/BirthdayList'
import NavBar from '../components/NavBar'
import '../styles/globals.css'
import '../styles/input.css'
import { UserContext } from '../lib/context';
import { useEffect, useState } from 'react';
import { useAuthState} from 'react-firebase-hooks/auth';
import { auth, firestore } from '../lib/firebase';
import AuthCheck from '../components/AuthCheck';
import { Toaster } from 'react-hot-toast';
import Controls from '../components/Controls';
import { Grid } from '@material-ui/core';
import Head from 'next/head';
import { useUserData } from '../lib/hooks';

function MyApp({ Component, pageProps }) {
  const { user, loading, error, emailNotification, loadNotifications } = useUserData();

  console.log(emailNotification, loadNotifications)
  return (
    <>
        <UserContext.Provider value={{user, loading, error, emailNotification, loadNotifications}}>
          <Head>
          </Head>
          <Toaster />
          <main>
            <Grid container>
              <AuthCheck fallback={<Component {...pageProps} />}>
                  <Controls>
                    <Component {...pageProps} />
                  </Controls>
              </AuthCheck>
            </Grid>
          </main>
        </UserContext.Provider>
    </>
  )
}

export default MyApp