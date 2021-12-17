import { config } from 'dotenv';
import firebase from 'firebase/app';
import 'firebase/firestore';

config();
console.log("firebase")
console.log(process.env.REACT_APP_FIREBASE_AUTHDOMAIN)
console.log(process.env.REACT_APP_FIREBASE_APP_ID)
interface IFirebaseConfig {
    apiKey: string,
    authDomain: string,
    projectId: string,
    storageBucket: string,
    messagingSenderId: string,
    appId: string
}

const firebaseConfig: IFirebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || '',
    authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN || '',
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET || '',
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.REACT_APP_FIREBASE_APP_ID || ''
};

firebase.initializeApp(firebaseConfig);

export default firebase;