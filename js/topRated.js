const API_URL = 'https://api.themoviedb.org/3/movie/top_rated?api_key=4113f3ad734e747a5b463cde8c55de42&language=en-US&page=1';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

const grid = document.getElementById('recommended-grid');
const cardTemplate = document.getElementById('movie-card-template');

/**
 * Fetches TMDB top rated movies and populates the "Recommended for you" grid.
 */
async function populateTopRated() {
    if (!grid || !cardTemplate) return;

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`TMDB responded with ${response.status}`);

        const data = await response.json();
        renderCards(data.results ?? []);
    } catch (error) {
        showError(error);
    }
}

/**
 * Render up to eight cards inside the grid.
 * @param {Array} movies
 */
function renderCards(movies) {
    grid.innerHTML = '';

    if (!movies.length) {
        grid.innerHTML = '<p class="col-span-full text-center text-gray-400 text-sm py-10">No movies found.</p>';
        return;
    }

    movies.slice(0, 8).forEach((movie) => {
        const cardFragment = cardTemplate.content.cloneNode(true);
        const img = cardFragment.querySelector('img');
        const title = cardFragment.querySelector('.movie-title');
        const genre = cardFragment.querySelector('.movie-genre');
        const rating = cardFragment.querySelector('.movie-rating');

        img.src = movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : 'https://placehold.co/400x600?text=No+Image';
        img.alt = `${movie.title} poster`;

        title.textContent = movie.title ?? 'Untitled';
        genre.textContent = movie.release_date ? `Released: ${movie.release_date}` : 'Release date TBD';
        rating.textContent = Number(movie.vote_average).toFixed(1);

        grid.appendChild(cardFragment);
    });
}

function showError(error) {
    grid.innerHTML = `<p class="col-span-full text-center text-red-400 text-sm py-10">Failed to load movies: ${error.message}</p>`;
}

populateTopRated();

