import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore, collection, addDoc, query, where, getDocs, 
  deleteDoc, doc, updateDoc
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

document.addEventListener('DOMContentLoaded', async () => {
  // DOM elements should be accessed after the DOM is fully loaded
  const addMovieButton = document.querySelector('#add-btn');
  const moviesElem = document.querySelector('#movies');
  
  // Function to add a movie to the Firestore database
  async function addMovie(movie) {
    // Check if the movie already exists
    const movieQuery = query(collection(db, 'movies'), where('title', '==', movie.title));
    const querySnapshot = await getDocs(movieQuery);
    if (!querySnapshot.empty) {
      alert('A movie with this title already exists!');
      return;
    }
  
    try {
      await addDoc(collection(db, 'movies'), movie);
      alert('Movie added!');
      displayAllMovies(); // Refresh the list of movies
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }
  
  // Function to delete a movie from the Firestore database
  async function deleteMovie(movieId) {
    try {
      await deleteDoc(doc(db, 'movies', movieId));
      displayAllMovies(); // Refresh the list of movies
    } catch (error) {
      console.error("Error deleting movie: ", error);
    }
  }
  
  // Function to mark a movie as watched in the Firestore database
  async function markAsWatched(movieId) {
    try {
      const movieRef = doc(db, 'movies', movieId);
      await updateDoc(movieRef, {
        watched: true
      });
      displayAllMovies(); // Refresh the list of movies
    } catch (error) {
      console.error("Error updating movie: ", error);
    }
  }
  
  // Function to create HTML elements for movies and add them to the DOM
  function createMovieElement(movie) {
    const containerElem = document.createElement('div');
    const titleElem = document.createElement('h2');
    const genreElem = document.createElement('p');
    const releaseDateElem = document.createElement('p');
    const deleteButton = document.createElement('button');
    const watchedButton = document.createElement('button');
    
    titleElem.textContent = movie.title;
    genreElem.textContent = movie.genre;
    releaseDateElem.textContent = `Release Date: ${movie.releaseDate}`;
    deleteButton.textContent = 'Delete';
    watchedButton.textContent = movie.watched ? 'Watched' : 'Mark as Watched';
  
    containerElem.appendChild(titleElem);
    containerElem.appendChild(genreElem);
    containerElem.appendChild(releaseDateElem);
    containerElem.appendChild(deleteButton);
    containerElem.appendChild(watchedButton);
    
    deleteButton.onclick = () => deleteMovie(movie.id);
    watchedButton.onclick = () => markAsWatched(movie.id);
  
    moviesElem.appendChild(containerElem);
  }
  
  // Function to display all movies in the DOM
  async function displayAllMovies() {
    moviesElem.innerHTML = ''; // Clear the movies element
    const querySnapshot = await getDocs(collection(db, 'movies'));
    const movies = [];
    querySnapshot.forEach((doc) => {
      movies.push({ id: doc.id, ...doc.data() });
    });
    movies.forEach(createMovieElement);
  }
  
  // Event listener for the 'Add Movie' button
  addMovieButton.addEventListener('click', async () => {
    const titleInput = document.querySelector('#title-input');
    const genreInput = document.querySelector('#genre-input');
    const releaseDateInput = document.querySelector('#release-date-input');
    
    const movie = {
        title: titleInput.value,
        genre: genreInput.value,
        releaseDate: releaseDateInput.value,
        watched: false, // Default to not watched
        createdAt: new Date().toISOString() // Store as an ISO string
      };
      
      await addMovie(movie);
      titleInput.value = '';
      genreInput.value = '';
      releaseDateInput.value = ''; // Clear the inputs after adding
    });
  
    // Call displayAllMovies to show all movies when the page is loaded
    await displayAllMovies();
  });
  
