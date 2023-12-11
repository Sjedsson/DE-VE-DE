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
  const addMovieButton = document.querySelector('#add-btn');
  const searchButton = document.querySelector('#search-btn');
  const moviesElem = document.querySelector('#movies');

  async function addMovie(movie) {
    const movieQuery = query(collection(db, 'movies'), where('title', '==', movie.title));
    const querySnapshot = await getDocs(movieQuery);
    if (!querySnapshot.empty) {
      alert('A movie with this title already exists!');
      return;
    }
  
    try {
      await addDoc(collection(db, 'movies'), movie);
      alert('Movie added!');
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }

  async function deleteMovie(movieId) {
    try {
      await deleteDoc(doc(db, 'movies', movieId));
      displayAllMovies(); // Optionally refresh the list
    } catch (error) {
      console.error("Error deleting movie: ", error);
    }
  }

  async function markAsWatched(movieId) {
    try {
      const movieRef = doc(db, 'movies', movieId);
      await updateDoc(movieRef, {
        watched: true
      });
      displayAllMovies(); // Optionally refresh the list
    } catch (error) {
      console.error("Error updating movie: ", error);
    }
  }

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

  async function displayAllMovies() {
    moviesElem.innerHTML = '';
    const querySnapshot = await getDocs(collection(db, 'movies'));
    querySnapshot.forEach((doc) => {
      createMovieElement({ id: doc.id, ...doc.data() });
    });
  }

  addMovieButton.addEventListener('click', async () => {
    const titleInput = document.querySelector('#title-input');
    const genreInput = document.querySelector('#genre-input');
    const releaseDateInput = document.querySelector('#release-date-input');

    const movie = {
      title: titleInput.value,
      genre: genreInput.value,
      releaseDate: releaseDateInput.value,
      watched: false,
      createdAt: new Date().toISOString()
    };

    await addMovie(movie);
    titleInput.value = '';
    genreInput.value = '';
    releaseDateInput.value = '';
  });

  searchButton.addEventListener('click', async () => {
    const searchValue = document.querySelector('#search-input').value.trim();
    if (searchValue) {
      await searchMovies(searchValue);
    } else {
      alert("Please enter a search term.");
    }
  });

  async function searchMovies(searchTerm) {
    moviesElem.innerHTML = ''; // Clear the list before displaying search results
    const searchQuery = query(collection(db, 'movies'), where('title', '==', searchTerm));
        const querySnapshot = await getDocs(searchQuery);
        if (querySnapshot.empty) {
          moviesElem.innerHTML = 'No movies found matching your search.';
        } else {
          querySnapshot.forEach((doc) => {
            createMovieElement({ id: doc.id, ...doc.data() });
          });
        }
      }
    
      // Optional: If you want to have a button to manually trigger the display of all movies
      const showAllMoviesButton = document.querySelector('#show-all-btn');
      if (showAllMoviesButton) {
        showAllMoviesButton.addEventListener('click', displayAllMovies);
      }
    });
    