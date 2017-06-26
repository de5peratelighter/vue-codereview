import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyDgQjpMQf2p421ymTNbY-ZBf_giRphPUFw",
    authDomain: "codereview-vue.firebaseapp.com",
    databaseURL: "codereview-vue.firebaseio.com",
    messagingSenderId: "463670284887",
    senderId : "463670284887"
};

var FBApp = firebase.initializeApp(firebaseConfig)

export default FBApp.database()