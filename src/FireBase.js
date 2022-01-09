import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAemQhivNHNsroZw3s_BcSNHAmGeL7RIHM",
  authDomain: "instagram-clone-react-d6cc8.firebaseapp.com",
  projectId: "instagram-clone-react-d6cc8",
  storageBucket: "instagram-clone-react-d6cc8.appspot.com",
  messagingSenderId: "199972253557",
  appId: "1:199972253557:web:1aeefb10e58f4b47d26d3c",
  measurementId: "G-QNFPRV79D0",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth;
 const storage = getStorage(firebaseApp);

export { db,auth ,storage};
