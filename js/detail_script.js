const API_KEY = '4113f3ad734e747a5b463cde8c55de42';
const BASE_URL = "https://api.themoviedb.org/3/movie/";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

// 1. GET MOVIE ID FROM URL
const params = new URLSearchParams(window.location.search);
const movieId = params.get("movieId");

if (!movieId) {
    alert("No movie ID found in URL!");
    throw new Error("Missing movieId");
}

// 2. FETCH MOVIE DETAILS
async function fetchMovieDetails() {
    try {
        const res = await fetch(`${BASE_URL}${movieId}?api_key=${API_KEY}&language=en-US`);
        const movie = await res.json();
        displayDetails(movie);
    } catch (err) {
        console.error("Error fetching movie details:", err);
    }
}

// 3. DISPLAY MOVIE DETAILS
function displayDetails(movie) {
    // Poster
    const poster = document.getElementById("movie-poster");
    poster.src = movie.poster_path ? IMAGE_BASE + movie.poster_path : "https://placehold.co/500x750";
    poster.onload = () => {
        document.getElementById("poster-loader").style.display = "none";
        poster.classList.remove("opacity-0");
        poster.classList.add("opacity-100");
    };

    // Text content
    document.getElementById("movie-title").textContent = movie.title;
    document.getElementById("movie-release-date").textContent = movie.release_date || "--";
    document.getElementById("movie-overview").textContent = movie.overview || "No overview available.";

    // Genres
    document.getElementById("movie-genres").textContent =
        movie.genres?.map(g => g.name).join(", ") || "--";

    // Rating
    const rating = (movie.vote_average / 2).toFixed(1); // Convert 10 → 5 stars
    document.getElementById("rating-label").textContent = `Rating ${rating}/5`;

    renderStars(rating);

    // Trailer button
    fetchMovieTrailer();
}

// 4. RENDER STAR RATING
function renderStars(rating) {
    const starWrapper = document.getElementById("rating-stars");
    starWrapper.innerHTML = "";

    for (let i = 1; i <= 5; i++) {
        starWrapper.innerHTML += `<i class="fa-${i <= rating ? "solid" : "regular"} fa-star"></i>`;
    }
}

    // 5. FETCH MOVIE TRAILER
    async function fetchMovieTrailer() {
        const res = await fetch(`${BASE_URL}${movieId}/videos?api_key=${API_KEY}`);
        const data = await res.json();

        const trailerBtn = document.getElementById("trailer-btn");
        const poster = document.getElementById("movie-poster");
        const iframe = document.getElementById("movie-trailer");

        // Find YouTube trailer
        const trailer = data.results.find(v => v.type === "Trailer" && v.site === "YouTube");

        if (!trailer) {
            trailerBtn.disabled = true;
            trailerBtn.textContent = "Trailer Not Available";
            return;
        }

        // On click → switch poster to trailer
        trailerBtn.addEventListener("click", () => {
            iframe.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;

            // Hide Poster, Show Trailer
            poster.classList.add("hidden");
            iframe.classList.remove("hidden");
        });
    }


// 6. FETCH CAST
async function fetchCast() {
    const res = await fetch(`${BASE_URL}${movieId}/credits?api_key=${API_KEY}`);
    const data = await res.json();
    renderCast(data.cast.slice(0, 10));
}

function renderCast(castList) {
    const wrapper = document.getElementById("actors-wrapper");
    const template = document.getElementById("actor-card-template");

    castList.forEach(actor => {
        const card = template.content.cloneNode(true);

        card.querySelector(".actor-image").src =
            actor.profile_path ? IMAGE_BASE + actor.profile_path : "https://placehold.co/256x384";
        card.querySelector(".actor-name").textContent = actor.name;
        card.querySelector(".actor-role").textContent = actor.character;

        wrapper.appendChild(card);
    });
}


// 7. FETCH RECOMMENDED MOVIES
async function fetchRecommended() {
    const res = await fetch(`${BASE_URL}${movieId}/recommendations?api_key=${API_KEY}`);
    const data = await res.json();
    renderRecommended(data.results.slice(0, 8));
}

function renderRecommended(movies) {
    const grid = document.getElementById("related-grid");
    const template = document.getElementById("related-card-template");

    grid.innerHTML = "";

    movies.forEach(movie => {
        const card = template.content.cloneNode(true);

        const wrapper = card.querySelector(".movie-card");
        const img = card.querySelector("img");
        const title = card.querySelector(".movie-title");
        const rating = card.querySelector(".movie-rating");
        const genre = card.querySelector(".movie-genre");

        wrapper.dataset.movieId = movie.id;

        img.src = movie.poster_path
            ? IMAGE_BASE + movie.poster_path
            : "https://placehold.co/300x450?text=No+Image";
        title.textContent = movie.title;
        rating.textContent = movie.vote_average?.toFixed(1) ?? "N/A";
        genre.textContent = movie.release_date || "--";

        wrapper.addEventListener("click", () => {
            window.location.href = `./detail.html?movieId=${movie.id}`;
        });

        grid.appendChild(card);
    });
}

// 8. START FETCHING EVERYTHING
fetchMovieDetails();
fetchCast();
fetchRecommended();



