import * as firebase from 'firebase'

import config from './firebaseConfig';
const firebaseApp = firebase.initializeApp(config);

export const databaseRef = firebase.database().ref();
export const todosRef = databaseRef.child("todos");
export default firebaseApp;