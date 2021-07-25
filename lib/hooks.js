import { useAuthState } from 'react-firebase-hooks/auth'; 
import { auth, firestore } from '../lib/firebase';
import { useEffect, useState } from 'react';

export function useUserData() {
    const [user, loading, error] = useAuthState(auth);

    // Listen to real-time updates to fetch additional data based on another 
    // input not available at loading time (i.e. user state)
    const [loadNotifications, setLoadNotifications] = useState(true)
    const [emailNotification, setEmailNotifications] = useState(null);
    
    useEffect(() => {
      // variable to turn of real-time subscription
      let unsubscribe;
  
      if (user) {
        // Fetch 
        const emailRef = firestore.doc(`users/${user.uid}/notifications/email`);
        unsubscribe = emailRef.onSnapshot((doc) => {
            setEmailNotifications(doc.data());
            setLoadNotifications(false);
        });
      } else {
        setEmailNotifications(null);
      }
  
      return unsubscribe;
    }, [user, loading])

    return { user, loading, error, emailNotification, loadNotifications };
}