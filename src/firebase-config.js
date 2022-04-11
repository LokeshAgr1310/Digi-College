// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDIkk3sY1JLiia2e3-LO7Wa8IMYzx2usYM",
    authDomain: "digi-college-87462.firebaseapp.com",
    projectId: "digi-college-87462",
    storageBucket: "digi-college-87462.appspot.com",
    messagingSenderId: "376718829923",
    appId: "1:376718829923:web:f17e9216ea3172fc664b56",
    measurementId: "G-Z19LH9EYXD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const db = getFirestore(app)

export default app