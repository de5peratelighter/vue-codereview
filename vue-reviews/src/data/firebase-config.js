import firebase from 'firebase';

const firebaseConfigProd = {
    apiKey: "AIzaSyBUCKGpYh2wdDgo9v6jP-BZl3rU0lGCHv8",
    authDomain: "test-vue-bob.firebaseapp.com",
    databaseURL: "https://test-vue-bob.firebaseio.com",
    messagingSenderId: "463670284887",
    senderId : "463670284887"
}


const theApp = firebase.initializeApp(firebaseConfigProd)

export const messaging = theApp.messaging()
export const FBApp = theApp.database()
