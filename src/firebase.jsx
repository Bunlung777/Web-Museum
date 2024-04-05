import { initializeApp,storage } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDdq4zPAzGgWOroYFjQHzHUqPAqL_xE7O0",
  authDomain: "museumapp-42cda.firebaseapp.com",
  projectId: "museumapp-42cda",
  storageBucket: "museumapp-42cda.appspot.com",
  messagingSenderId: "652751305131",
  appId: "1:652751305131:web:5c0f01597ad2cc99b8baee",
  measurementId: "G-RKPSHS4BVF"
};


const app = initializeApp(firebaseConfig);

export const firebase = getFirestore(app)

