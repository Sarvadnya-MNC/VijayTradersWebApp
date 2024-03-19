// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCckHzniODm3ODXxRzx-HF5-GiH0gzc3i0",
  authDomain: "vijaytraders-cccdb.firebaseapp.com",
  projectId: "vijaytraders-cccdb",
  storageBucket: "vijaytraders-cccdb.appspot.com",
  messagingSenderId: "960572696735",
  appId: "1:960572696735:web:fbe9290dace07c5ad35aaa",
  measurementId: "G-2RM757VLPP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)