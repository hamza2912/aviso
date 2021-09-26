import firebase from 'firebase';
//import "firebase/auth";
//import "firebase/database";
//import "firebase/firestore";
//import "firebase/functions";
//import "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDrCO8RJQ26mn39DsguC0uPwA5kjnYV_LQ",
    authDomain: "barcode-test-8dd93.firebaseapp.com",
    projectId: "barcode-test-8dd93",
    databaseURL: "https://barcode-test-8dd93-default-rtdb.firebaseio.com/",
    storageBucket: "barcode-test-8dd93.appspot.com",
    messagingSenderId: "41994190278",
    appId: "1:41994190278:web:f0151276c0eda9fc28c6c7"
  };

firebase.initializeApp(firebaseConfig);