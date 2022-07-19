// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken } from "firebase/messaging"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Firebase Cloud Messaging and get a reference to the service
export const messaging = getMessaging(app)

export const db = getFirestore(app)

export const requestForToken = () => {
    console.log("I am here...")
    return getToken(messaging, { vapidKey: "BEmajA5tqyreMTZ1UYSsQ1snNWsPbo-vyBAdmNtelqCp3t8BDhkEX-Ad8b7OC4L65XsquseJpSZv8lpsenh4dBA" })
        .then((currentToken) => {
            if (currentToken) {
                console.log('current token for client: ', currentToken);
                // Perform any other neccessary action with the token
            } else {
                // Show permission request UI
                console.log('No registration token available. Request permission to generate one.');
            }
        })
        .catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
        });
};

export default app