import firebase from 'firebase';

var firebaseConfig = {
  apiKey: "AIzaSyBXGbcm4vxcD4sKLcyOqBLl__O8Q4fPYdE",
  authDomain: "reviewappforira.firebaseapp.com",
  databaseURL: "reviewappforira.firebaseio.com",
  messagingSenderId: "463670284887",
  senderId: "463670284887"
};

// var firebaseConfig = {
//   apiKey: "AIzaSyDgQjpMQf2p421ymTNbY-ZBf_giRphPUFw",
//   authDomain: "codereview-vue.firebaseapp.com",
//   databaseURL: "codereview-vue.firebaseio.com",
//   messagingSenderId: "463670284887",
//   senderId : "463670284887"
// };

var theApp = firebase.initializeApp(firebaseConfig)

export const messaging = theApp.messaging()
export const FBApp = theApp.database()
