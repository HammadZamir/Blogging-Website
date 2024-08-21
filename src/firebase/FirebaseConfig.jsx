import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD5xTpupK48CK_9Xh2yZUmeM6GZOlqyP48",
  authDomain: "blog-website-8ef22.firebaseapp.com",
  projectId: "blog-website-8ef22",
  storageBucket: "blog-website-8ef22.appspot.com",
  messagingSenderId: "852191218458",
  appId: "1:852191218458:web:a84f39074fbc63b1b47aa3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const fireDb = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export {fireDb , auth , storage};