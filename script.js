// app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getFirestore, collection, addDoc, 
  query, where, getDocs 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzd-Lx5c-Wt_0KheDqwiqSZB8QSh2cwnc",
  authDomain: "de-ve-de-f5997.firebaseapp.com",
  projectId: "de-ve-de-f5997",
  storageBucket: "de-ve-de-f5997.appspot.com",
  messagingSenderId: "535714584444",
  appId: "1:535714584444:web:64c3d52a1d07dd62dcf6f9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM elements
const addMovieButton = document.querySelector('#add-btn');
const searchButton = document.querySelector('#search-btn');
const moviesElem = document.querySelector('#movies');

// Add a movie to the Firestore database
async function addMovie(movie) {
  try {
    const docRef = await addDoc(collection(db, 'movies'), movie);
    console.log("Document written with ID: ", docRef.id);
    alert('Movie added!');
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}

// Search for movies by title in the Firestore database
async function searchMovies(title) {
  try {
    const q = query(collection(db, 'movies'), where('title', '==', title));
    const querySnapshot = await getDocs(q);
    const movies = [];
    querySnapshot.forEach((doc) => {
      movies.push({ id: doc.id, ...doc.data() });
    });
    return movies;
  } catch (error) {
    console.error("Error getting documents: ", error);
  }
}

// Create HTML elements for movies and add them to the DOM
function createMovieElement(movie) {
  const containerElem = document.createElement('div');
  const titleElem = document.createElement('h2');
  const genreElem = document.createElement('p');
  
  titleElem.textContent = movie.title;
  genreElem.textContent = movie.genre;
  
  containerElem.appendChild(titleElem);
  containerElem.appendChild(genreElem);
  moviesElem.appendChild(containerElem);
}

// Display movies in the DOM
function displayMovies(movies) {
  moviesElem.innerHTML = ''; // Clear the movies element
  movies.forEach(createMovieElement);
}

// Event listener for the 'Add Movie' button
addMovieButton.addEventListener('click', async () => {
  const titleInput = document.querySelector('#title-input');
  const genreInput = document.querySelector('#genre-input');
  
  const movie = {
    title: titleInput.value,
    genre: genreInput.value,
    createdAt: new Date()
  };
  
  await addMovie(movie);
  titleInput.value = ''; // Clear the input
  genreInput.value = ''; // Clear the input
});

// Event listener for the 'Search' button
searchButton.addEventListener('click', async () => {
  const searchInput = document.querySelector('#search-input');
  const movies = await searchMovies(searchInput.value);
  displayMovies(movies);
  searchInput.value = ''; // Clear the input
});
