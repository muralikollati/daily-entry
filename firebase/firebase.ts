// Import the functions you need from the SDKs you need

import { initializeApp } from "@react-native-firebase/app";
import auth from '@react-native-firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyBVbOElyyX_UNv5Dm0DBcmp5QyHMxgTYOQ",
  authDomain: "users-entry.firebaseapp.com",
  projectId: "users-entry",
  storageBucket: "users-entry.firebasestorage.app",
  messagingSenderId: "279247248813",
  appId: "1:279247248813:web:aaced2d7859a44bf1c9524",
  measurementId: "G-9MCVNX3CVV"
};

const app = initializeApp(firebaseConfig);

// const auth = getAuth(app);

// if (Platform.OS === 'web') {
//   auth = getAuth(app);
// } else {
//   auth = initializeAuth(app, {
//     persistence: getReactNativePersistence(AsyncStorage),
//   });
// }
// console.log("Firebase initialized", auth.currentUser);

export { auth };
