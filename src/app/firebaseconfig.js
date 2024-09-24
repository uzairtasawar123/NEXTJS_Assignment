import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyC80tZ2frvpnSE52POrODxiI50fxc3-QcM",
    authDomain: "nextjsassignment.firebaseapp.com",
    projectId: "nextjsassignment",
    storageBucket: "nextjsassignment.appspot.com",
    messagingSenderId: "60466249100",
    appId: "1:60466249100:web:4da119ad28a62e2078aaa9",
    measurementId: "G-YL4YLFV4G0"
  };

const app = initializeApp(firebaseConfig);
// const storage = firebase.storage();
const storage = getStorage(app);

const db = getFirestore(app);

export { db ,storage};
