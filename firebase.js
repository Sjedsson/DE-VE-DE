import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAzd-Lx5c-Wt_0KheDqwiqSZB8QSh2cwnc",
  authDomain: "de-ve-de-f5997.firebaseapp.com",
  projectId: "de-ve-de-f5997",
  storageBucket: "de-ve-de-f5997.appspot.com",
  messagingSenderId: "535714584444",
  appId: "1:535714584444:web:64c3d52a1d07dd62dcf6f9",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc };
