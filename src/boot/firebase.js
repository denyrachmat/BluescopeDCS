// import { boot } from 'quasar/wrappers'

// // "async" is optional;
// // more info on params: https://v2.quasar.dev/quasar-cli/boot-files
// export default boot(async (/* { app, router, ... } */) => {
//   // something to do
// })
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyBTK-MYxSDDxpabGO5dkr8gsNNp6TBb498",
  authDomain: "bluescope-dcs.firebaseapp.com",
  projectId: "bluescope-dcs",
  storageBucket: "bluescope-dcs.appspot.com",
  messagingSenderId: "941660173387",
  appId: "1:941660173387:web:b05a7fc690d05f889909ce",
  scope: [
    'https://www.googleapis.com/auth/script.projects',
    'https://www.googleapis.com/auth/drive'
  ]
};

const app = initializeApp(firebaseConfig);

export default app

// if (!firebase.apps) {
//   firebase.initializeApp(firebaseConfig);
// }

// // firebase.getCurrentUser = () => {
// //   return new Promise((resolve, reject) => {
// //     const unsubscribe = firebase.auth().onAuthStateChanged(user => {
// //       unsubscribe();
// //       resolve(user);
// //     }, reject);
// //   })
// // };

// export default firebase
