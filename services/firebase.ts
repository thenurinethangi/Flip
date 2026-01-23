import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// @ts-ignore
import { initializeAuth, getReactNativePersistence } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import AsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCFWrRuTpJT2mQtQAjkmGAWcFhwlKU4fkk",
    authDomain: "flip-329a0.firebaseapp.com",
    projectId: "flip-329a0",
    storageBucket: "flip-329a0.firebasestorage.app",
    messagingSenderId: "831824482548",
    appId: "1:831824482548:web:637e0477469edf36e90ea1",
    measurementId: "G-SGPP9MLZS0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);