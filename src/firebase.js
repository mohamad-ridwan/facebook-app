// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getStorage} from 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDhhbR1hkcyJirn1CIjoWPe6krPxWhwrp8",
  authDomain: "facebook-rp.firebaseapp.com",
  projectId: "facebook-rp",
  storageBucket: "facebook-rp.appspot.com",
  messagingSenderId: "694062852988",
  appId: "1:694062852988:web:c759f975552e34350d52f9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)