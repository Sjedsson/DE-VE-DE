import { db, collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc } from "./firebase.js";

document.addEventListener('DOMContentLoaded', async () => {
  const addMovieButton = document.querySelector('#add-btn');
  const searchButton = document.querySelector('#search-btn');
  const moviesElem = document.querySelector('#movies');
  const favoritesButton = document.querySelector('#favorites-btn');

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
      refreshMovieList();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }

  async function deleteMovie(movieId) {
    try {
      await deleteDoc(doc(db, 'movies', movieId));
      refreshMovieList();
    } catch (error) {
      console.error("Error deleting movie: ", error);
    }
  }

  async function toggleWatched(movie, watchedButton) {
    movie.watched = !movie.watched;
    try {
      const movieRef = doc(db, 'movies', movie.id);
      await updateDoc(movieRef, { watched: movie.watched });
      watchedButton.textContent = movie.watched ? 'Remove from Watched' : 'Mark as Watched';
    } catch (error) {
      console.error("Error updating watched status: ", error);
      movie.watched = !movie.watched;
    }
  }

  async function toggleFavorite(movie, favoritesButton) {
    movie.favorites = !movie.favorites;
    try {
      const movieRef = doc(db, 'movies', movie.id);
      await updateDoc(movieRef, { favorites: movie.favorites });
      favoritesButton.textContent = movie.favorites ? 'Remove from Favorites' : 'Add to Favorites';
    } catch (error) {
      console.error("Error updating favorite status: ", error);
      movie.favorites = !movie.favorites;
    }
  }

  async function refreshMovieList() {
    moviesElem.innerHTML = '';
    const querySnapshot = await getDocs(collection(db, 'movies'));
    querySnapshot.forEach((doc) => {
      createMovieElement({ id: doc.id, ...doc.data() });
    });
  }

  function createMovieElement(movie) {
    const containerElem = document.createElement('div');
    containerElem.setAttribute('data-movie-id', movie.id);
    
    const titleElem = document.createElement('h2');
    titleElem.textContent = movie.title;
    
    const genreElem = document.createElement('p');
    genreElem.textContent = movie.genre;
    
    const releaseDateElem = document.createElement('p');
    releaseDateElem.textContent = `Release Date: ${movie.releaseDate}`;
    
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => deleteMovie(movie.id);
    
    const watchedButton = document.createElement('button');
    watchedButton.textContent = movie.watched ? 'Remove from Watched' : 'Mark as Watched';
    watchedButton.onclick = () => toggleWatched(movie, watchedButton);
    
    const favoritesButton = document.createElement('button');
    favoritesButton.textContent = movie.favorites ? 'Remove from Favorites' : 'Add to Favorites';
    favoritesButton.onclick = () => toggleFavorite(movie, favoritesButton);

    containerElem.appendChild(titleElem);
    containerElem.appendChild(genreElem);
    containerElem.appendChild(releaseDateElem);
    containerElem.appendChild(deleteButton);
    containerElem.appendChild(watchedButton);
    containerElem.appendChild(favoritesButton);

    moviesElem.appendChild(containerElem);
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
      favorites: false,
      createdAt: new Date().toISOString()
    };

    titleInput.value = '';
    genreInput.value = '';
    releaseDateInput.value = '';

    await addMovie(movie);
  });

  searchButton.addEventListener('click', async () => {
    const searchValue = document.querySelector('#search-input').value.trim();
    await searchMovies(searchValue);
  });

  async function searchMovies(searchTerm) {
    moviesElem.innerHTML = '';
    const searchQuery = query(collection(db, 'movies'), where('title', '==', searchTerm));
    const querySnapshot = await getDocs(searchQuery);
    if (querySnapshot.empty) {
      moviesElem.innerHTML = '<p>No movies found matching your search.</p>';
    } else {
      querySnapshot.forEach((doc) => {
        createMovieElement({ id: doc.id, ...doc.data() });
      });
    }
  }

  favoritesButton.addEventListener('click', async () => {
    await displayFavorites();
  });

  async function displayFavorites() {
    moviesElem.innerHTML = '';
    const favoritesQuery = query(collection(db, 'movies'), where('favorites', '==', true));
    const querySnapshot = await getDocs(favoritesQuery);
    if (querySnapshot.empty) {
      moviesElem.innerHTML = '<p>No favorite movies yet.</p>';
    } else {
      querySnapshot.forEach((doc) => {
        createMovieElement({ id: doc.id, ...doc.data() });
      });
    }
  }
});
