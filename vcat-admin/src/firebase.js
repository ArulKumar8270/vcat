import { initializeApp } from 'firebase/app';
// import firebase from 'firebase'
import { getFirestore } from 'firebase/firestore';

// console.log("firebase", firebase);
const firebaseApp = {
    apiKey: "AIzaSyAuA7RaMqaokZ7h5bOf4DtrChBKroHjUBI",
  authDomain: "vcat-29547.firebaseapp.com",
  projectId: "vcat-29547",
  storageBucket: "vcat-29547.appspot.com",
  messagingSenderId: "681447378256",
  appId: "1:681447378256:web:a38beff0a11484f4e73055",
  measurementId: "G-VXK5BMYR3Z"
};

const app = initializeApp(firebaseApp);
const db = getFirestore(app);

export { app, db };