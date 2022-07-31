import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';


const firebaseConfig = {
    apiKey: "AIzaSyDlYVFSCO48IW3MGnsX6v6rTKcgfq0kX0k",
    authDomain: "whatsappclone-21a41.firebaseapp.com",
    projectId: "whatsappclone-21a41",
    storageBucket: "whatsappclone-21a41.appspot.com",
    messagingSenderId: "471269455987",
    appId: "1:471269455987:web:5746eb29aca34962335206",
    measurementId: "G-CPZ3SL00YV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth(app);
const authProvider = new GoogleAuthProvider();


export { auth, authProvider };
export default db;
