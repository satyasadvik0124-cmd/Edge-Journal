import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
}
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy
}
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {

  apiKey: "AIzaSyAbCYkLy5o-CWYpEb7w70WUEqCBstrfBC0",

  authDomain:
    "edge-journal-1294c.firebaseapp.com",

  projectId:
    "edge-journal-1294c",

  storageBucket:
    "edge-journal-1294c.firebasestorage.app",

  messagingSenderId:
    "141727137482",

  appId:
    "1:141727137482:web:b005a97b645811e9867e33"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

window.auth = auth;

window.db = db;

window.firebaseFns = {

  createUserWithEmailAndPassword,

  signInWithEmailAndPassword,

  signOut,

  onAuthStateChanged,

  updateProfile,

  collection,

  addDoc,

  getDocs,

  deleteDoc,

  updateDoc,

  doc,

  query,

  where,

  orderBy
};

window.currentUser = null;

window.trades = [];

window.charts = {};

window.editingTradeId = null;

window.selectedPhotos = [];