importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
    "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

// Initialize the Firebase app in the service worker
// "Default" Firebase configuration (prevents errors)
const firebaseConfig = {
    apiKey: "AIzaSyCZ1QvmR11SevdFTEqM01nHSuV3vhWNRlk",
    authDomain: "coursehust-1ff27.firebaseapp.com",
    projectId: "coursehust-1ff27",
    storageBucket: "coursehust-1ff27.appspot.com",
    messagingSenderId: "522654049340",
    appId: "1:522654049340:web:f4e0886126400aac078f39"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.image,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});