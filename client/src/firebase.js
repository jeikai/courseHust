// import firebase from 'firebase'

// const config = {
//     apiKey: "AIzaSyCZ1QvmR11SevdFTEqM01nHSuV3vhWNRlk",
//     authDomain: "coursehust-1ff27.firebaseapp.com",
//     projectId: "coursehust-1ff27",
//     storageBucket: "coursehust-1ff27.appspot.com",
//     messagingSenderId: "522654049340",
//     appId: "1:522654049340:web:f4e0886126400aac078f39"
// }

// firebase.initializeApp(config)

// export default firebase;

import { initializeApp } from "firebase/app";

import { getMessaging } from "firebase/messaging";

//Firebase Config values imported from .env file
const firebaseConfig = {
    apiKey: "AIzaSyCZ1QvmR11SevdFTEqM01nHSuV3vhWNRlk",
    authDomain: "coursehust-1ff27.firebaseapp.com",
    projectId: "coursehust-1ff27",
    storageBucket: "coursehust-1ff27.appspot.com",
    messagingSenderId: "522654049340",
    appId: "1:522654049340:web:f4e0886126400aac078f39"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Messaging service
export const messaging = getMessaging(app);