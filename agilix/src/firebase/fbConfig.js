import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'


//const APIKEY = process.env.REACT_APP_APIKEY

// const firebaseConfig = 
// {
//     apiKey: APIKEY,
//     authDomain: "kanban-42358.firebaseapp.com",
//     projectId: "kanban-42358",
//     storageBucket: "kanban-42358.appspot.com",
//     messagingSenderId: "300388039581",
//     appId: "1:300388039581:web:dc35b313665b4c310d8d74",
//     measurementId: "G-KCLK585LB9"
// };
const firebaseConfig = {
    apiKey: "AIzaSyAA6wXJn5zr8pG3sWUJyf4FC5ICKKUPif0",
    authDomain: "react-chat-89c47.firebaseapp.com",
    projectId: "react-chat-89c47",
    storageBucket: "react-chat-89c47.appspot.com",
    messagingSenderId: "2168503267",
    appId: "1:2168503267:web:303bb5d8a2e47ca59c3ed6"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig)


const db = firebase.firestore()

// firebase.firestore().enablePersistence()

export { firebase, db }