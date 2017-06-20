import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyDgQjpMQf2p421ymTNbY-ZBf_giRphPUFw",
    authDomain: "codereview-vue.firebaseapp.com",
    databaseURL: "codereview-vue.firebaseio.com",
    messagingSenderId: "463670284887",
    senderId : "463670284887"
};

var FbApp = firebase.initializeApp(firebaseConfig);
console.log('FBAPP',FbApp )

export default FbApp.database();