const API_KEY = "14277c23"
const API_URL = "https://www.omdbapi.com/"

const movieModal = document.querySelector("#movie-modal");
const closeModal = document.querySelector("#close-modal");
const modalPoster = document.querySelector("#modal-poster");
const modalTitle = document.querySelector("#modal-title");
const modalYear = document.querySelector("#modal-year");
const modalRating = document.querySelector("#modal-rating");
const modalGenre = document.querySelector("#modal-genre");
const modalDirector = document.querySelector("#modal-director");
const modalActors = document.querySelector("#modal-actors");
const modalPlot = document.querySelector("#modal-plot");


let indexPage = document.querySelector("#search-input");
let favouritesPage = document.querySelector("#favourites-grid");


let searchInput, searchBtn, isLoading, errorMessage, resultsGrid;
let signInModal, closeSignIn, userInput, signInBtn, signInBtnHeader, favouritesLink, addFavouritesBtn;

    if (indexPage) {
        searchInput = document.getElementById("search-input");
        searchBtn = document.getElementById("search-btn");
        isLoading = document.getElementById("loading");
        errorMessage = document.getElementById("error-message");
        resultsGrid = document.getElementById("results-grid");
        signInBtn = document.getElementById("sign-in-btn-modal");
        signInModal = document.getElementById("sign-in-modal");
        closeSignIn = document.getElementById("close-sign-in-modal");
        userInput = document.getElementById("user-input");
        signInBtnHeader = document.getElementById("sign-in-btn");
        favouritesLink = document.getElementById("favourites-link");
        addFavouritesBtn = document.getElementById("add-favourites-btn");
}

    let userInfo, notLoggedIn, noFavourites, favouritesGrid, removeFavouritesBtn;

    if(favouritesPage) {
        userInfo = document.querySelector("#user-info");
        notLoggedIn = document.querySelector("#not-logged-in");
        noFavourites = document.querySelector("#no-favourites");
        favouritesGrid = document.querySelector("#favourites-grid");
        removeFavouritesBtn = document.querySelector("#remove-favourite-btn");
    }

    let currentUser = JSON.parse(localStorage.getItem("movieAppUser")) || null;
    let favourites = JSON.parse(localStorage.getItem("movieAppFavourites")) || [];

    let selectedMovie = null;

    function saveUser() {
        localStorage.setItem("movieAppUser", JSON.stringify(currentUser));
    }
    function saveFavourites() {
        localStorage.setItem("movieAppFavourites", JSON.stringify(favourites));
    }

    function updateUI() {
        if (indexPage) {
            if(currentUser) {
                signInBtnHeader.textContent = `Hi ${currentUser} | Sign out!`;
                favouritesLink.classList.remove("hidden")
            } else {
                signInBtnHeader.textContent = `Sign in!`;
                favouritesLink.classList.add("hidden");
            }
        }

        if (favouritesPage) {
            if(currentUser) {
                userInfo.textContent =`Signed in as ${currentUser}`;
                notLoggedIn.classList.add("hidden");
                favouritesGrid.classList.remove("hidden");
            } else {
                userInfo.textContent = ""
                notLoggedIn.classList.remove("hidden");
                favouritesGrid.classList.add("hidden");
            }
        }
    }

    function openSignInModal() {
        signInModal.classList.remove("hidden");
        userInput.value = "";
        userInput.focus()
    }

    function closeSignInModal() {
        signInModal.classList.add("hidden");
    }

    function signIn() {
        const name = userInput.value.trim()
        if(name) {
            currentUser = name;
            saveUser();
            updateUI()
            closeSignInModal();
        }
    }

    function signOut() {
        currentUser = null;
        saveUser();
        updateUI();
    }

    function handleAuthClick() {
        if(currentUser) {
            signOut()
        } else {
            openSignInModal()
        }
    }

    async function getMovieInfo(movieID) {
        try {
            const response = await fetch(`${API_URL}?apikey=${API_KEY}&i=${movieID}&plot=full`);
            const data = await response.json();

            if (data.Response === "True") {
                return data;
            } else {
                console.error("movie not found")
                return null;
            }
        } catch(error) {
            console.error("error fetching movie info", error);
            return null;
        }
    }

    async function openMovieModal(imdbID) {
        const movie = await getMovieInfo(imdbID);

        if (movie) {
            selectedMovie = movie;

            const poster = movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/250x375?text=No+Poster";
            modalPoster.src = poster;
            modalTitle.textContent = movie.Title;
            modalYear.textContent = `📅 ${movie.Year}`;
            modalRating.textContent = `⭐ ${movie.imdbRating}/10`;
            modalGenre.textContent = `🎭 ${movie.Genre}`;
            modalDirector.textContent = `🎬 Director: ${movie.Director}`;
            modalActors.textContent = `👥 Cast: ${movie.Actors}`;
            modalPlot.textContent = movie.Plot;

            // Update favourite button if on index page
            if (indexPage && addFavouritesBtn) {
                const isFavourite = favourites.some(fav => fav.imdbID === movie.imdbID);
                if (isFavourite) {
                    addFavouritesBtn.textContent = "✓ In Favourites";
                    addFavouritesBtn.disabled = true;
                } else {
                    addFavouritesBtn.textContent = "❤️ Add to Favourites";
                    addFavouritesBtn.disabled = false;
                }
            }

            movieModal.classList.remove("hidden");
        }
    }

    async function searchMovies(query) {
    isLoading.classList.remove("hidden");
    errorMessage.classList.add("hidden");
    resultsGrid.innerHTML = "";

    try {
        const response = await fetch(`${API_URL}?apikey=${API_KEY}&s=${query}`);
        const data = await response.json();

        isLoading.classList.add("hidden");

        if (data.Response === "True") {
            displayMovies(data.Search);
        } else {
            errorMessage.classList.remove("hidden");
        }
    } catch (error) {
        isLoading.classList.add("hidden");
        errorMessage.classList.remove("hidden");
        console.error("Error fetching movies:", error);
    }
    }

    function displayMovies(movies) {
    resultsGrid.innerHTML = "";

    movies.forEach(movie => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");
        movieCard.dataset.id = movie.imdbID;

        const poster = movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/200x300?text=No+Poster";

        movieCard.innerHTML = `
            <img src="${poster}" alt="${movie.Title}">
            <div class="movie-card-info">
                <h3>${movie.Title}</h3>
                <p>${movie.Year}</p>
            </div>
        `;

        resultsGrid.appendChild(movieCard);
    });
}

    function closeMovieModal() {
    movieModal.classList.add("hidden");
    selectedMovie = null;
    }

    function addToFavourites() {
    if (!currentUser) {
        alert("Please sign in to favourite");
        return;
    }

    if (!selectedMovie) return;

    if (favourites.some(fav => fav.imdbID === selectedMovie.imdbID)) return;

    const movieToSave = {
        imdbID: selectedMovie.imdbID,
        Title: selectedMovie.Title,
        Year: selectedMovie.Year,
        Poster: selectedMovie.Poster
    };

    favourites.push(movieToSave);
    saveFavourites();

    if (addFavouritesBtn) {
        addFavouritesBtn.textContent = "✓ In favourites";
        addFavouritesBtn.disabled = true;
    }
    }

    function removeFromFavourites() {
    if (selectedMovie) {
        favourites = favourites.filter(fav => fav.imdbID !== selectedMovie.imdbID);
        saveFavourites();
        closeMovieModal();
        displayFavourites();
    }
    }

    function displayFavourites() {
    if (!favouritesPage) return;

    favouritesGrid.innerHTML = "";

    if (favourites.length === 0) {
        noFavourites.classList.remove("hidden");
        return;
    }

    noFavourites.classList.add("hidden");

    favourites.forEach(movie => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");
        movieCard.dataset.id = movie.imdbID;

        const poster = movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/200x300?text=No+Poster";

        movieCard.innerHTML = `
            <img src="${poster}" alt="${movie.Title}">
            <div class="movie-card-info">
                <h3>${movie.Title}</h3>
                <p>${movie.Year}</p>
            </div>
        `;

        favouritesGrid.appendChild(movieCard);
    });
    }

    if (indexPage) {
    signInBtnHeader.addEventListener("click", handleAuthClick);
    closeSignIn.addEventListener("click", closeSignInModal);
    signInBtn.addEventListener("click", signIn);

    userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            signIn();
        }
    });

    signInModal.addEventListener("click", (e) => {
        if (e.target === signInModal) {
            closeSignInModal();
        }
    });

    searchBtn.addEventListener("click", () => {
        const query = searchInput.value.trim();
        if (query) {
            searchMovies(query);
        }
    });

    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            const query = searchInput.value.trim();
            if (query) {
                searchMovies(query);
            }
        }
    });

    // Click on movie card
    resultsGrid.addEventListener("click", (e) => {
        const card = e.target.closest(".movie-card");
        if (card) {
            openMovieModal(card.dataset.id);
        }
    });

    addFavouritesBtn.addEventListener("click", addToFavourites);
    }

    if (favouritesPage) {
    favouritesGrid.addEventListener("click", (e) => {
        const card = e.target.closest(".movie-card");
        if (card) {
            openMovieModal(card.dataset.id);
        }
    });

    removeFavouritesBtn.addEventListener("click", removeFromFavourites);
    }

    if (closeModal) {
    closeModal.addEventListener("click", closeMovieModal);
    }

    if (movieModal) {
    movieModal.addEventListener("click", (e) => {
        if (e.target === movieModal) {
            closeMovieModal();
        }
    })
    }

    updateUI();

    if (favouritesPage) {
    displayFavourites();
    }


