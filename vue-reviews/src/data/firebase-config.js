import firebase from 'firebase';

const firebaseConfigProd = {
    apiKey: "AIzaSyDgQjpMQf2p421ymTNbY-ZBf_giRphPUFw",
    authDomain: "codereview-vue.firebaseapp.com",
    databaseURL: "codereview-vue.firebaseio.com",
    messagingSenderId: "463670284887",
    senderId : "463670284887"
}

const firebaseConfigDev = {
    apiKey: "AIzaSyAjuwS1LjiJnauxfJe5W3xiVDXstR1YrF0",
    authDomain: "dev-codereview-vue.firebaseapp.com",
    databaseURL: "dev-codereview-vue.firebaseio.com",
    messagingSenderId: "432005203093",
    senderId:  "432005203093"
}

const isDev = location.hostname.match(/dev|localhost/i)
const theApp = firebase.initializeApp(isDev ? firebaseConfigDev : firebaseConfigProd)

export const messaging = theApp.messaging()
export const FBApp = theApp.database()
