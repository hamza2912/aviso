import firebase from 'firebase';
//import "firebase/auth";
//import "firebase/database";
//import "firebase/firestore";
//import "firebase/functions";
//import "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD0AqOdyC9gcaFpOx3Zl-OmGy5V6svoQhw",
  authDomain: "ns-collegiate.firebaseapp.com",
  projectId: "ns-collegiate",
  databaseURL: "https://ns-collegiate-default-rtdb.firebaseio.com/",
  storageBucket: "ns-collegiate.appspot.com",
  messagingSenderId: "241598912352",
  appId: "1:241598912352:web:6af0231a6ad72898e7b005"
  };

firebase.initializeApp(firebaseConfig);