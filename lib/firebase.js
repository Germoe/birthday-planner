import firebase from 'firebase/app';

// Bundle Services used into the JS Bundle
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

// Set up Firebase Config

// From Firebase account Project Settings Web App

const firebaseConfig = {
    apiKey: "AIzaSyCEXn2TIQ7rpTmUQWpuP9JWCodJPYIc4aE",
    authDomain: "birthday-planner-prototype.firebaseapp.com",
    projectId: "birthday-planner-prototype",
    storageBucket: "birthday-planner-prototype.appspot.com",
    messagingSenderId: "982535166739",
    appId: "1:982535166739:web:9c6e3c08c5739addafd8e6",
    measurementId: "G-58TQMYSDWW"
}

if (!firebase.apps.length) {
    // Required as Firebase can only be initialized once but without 
    // the condition above React could try to initialize Firebase multiple times
    firebase.initializeApp(firebaseConfig)
}

// Store and Expose SDK Variables for usage of Services
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();

// Auth Services
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

// Utility Firestore Functions
export const fromMillis = firebase.firestore.Timestamp.fromMillis;
export const fromDate = firebase.firestore.Timestamp.fromDate;
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp; // Timestamp on Server-Side