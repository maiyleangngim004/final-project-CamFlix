const API_KEY = '4113f3ad734e747a5b463cde8c55de42';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const PLACEHOLDER_IMAGE = 'https://placehold.co/500x750?text=No+Image';

const movieCardTemplate = document.getElementById('movie-card-template');
const recommendedGrid = document.getElementById('recommended-grid');
const topRatedGrid = document.getElementById('toprated-grid');
const popularGrid = document.getElementById('popular-grid');

let allTopRatedMovies = [];
let allPopularMovies = [];

function buildMovieCard(movie) {
    const cardFragment = movieCardTemplate?.content.cloneNode(true);
    if (!cardFragment) return null;

    const img = cardFragment.querySelector('img');
    const title = cardFragment.querySelector('.movie-title');
    const genre = cardFragment.querySelector('.movie-genre');
    const rating = cardFragment.querySelector('.movie-rating');

    if (img) {
        img.src = movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : PLACEHOLDER_IMAGE;
        img.alt = `${movie.title ?? 'Movie'} poster`;
    }
    if (title) title.textContent = movie.title ?? 'Untitled';
    if (genre) genre.textContent = `Release: ${movie.release_date || 'TBA'}`;
    if (rating) rating.textContent = Number(movie.vote_average ?? 0).toFixed(1);

    return cardFragment;
}

function renderMovies(grid, movies) {
    if (!grid) return;
    grid.innerHTML = '';

    if (!movies.length) {
        grid.innerHTML = '<p class="col-span-full text-center text-gray-400 text-sm py-10">No movies found.</p>';
        return;
    }

    movies.forEach((movie) => {
        const card = buildMovieCard(movie);
        if (card) grid.appendChild(card);
    });
}

async function loadMovies(url, onSuccess, onError) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
        const data = await response.json();
        onSuccess(data.results ?? []);
    } catch (error) {
        onError(error);
        console.error(error);
    }
}

function showError(grid, message) {
    if (!grid) return;
    grid.innerHTML = `<p class="col-span-full text-center text-red-500">${message}</p>`;
}

function setupToggle(button, grid, expandCb, collapseCb, collapsedHeight = '470px') {
    if (!button || !grid) return;
    let expanded = false;

    button.addEventListener('click', (event) => {
        event.preventDefault();
        expanded = !expanded;

        if (expanded) {
            grid.style.maxHeight = 'none';
            button.textContent = 'see less';
            expandCb?.();
        } else {
            grid.style.maxHeight = collapsedHeight;
            button.textContent = 'see all';
            collapseCb?.();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadMovies(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`,
        (results) => {
            allTopRatedMovies = results;
            renderMovies(topRatedGrid, results.slice(0, 4));
        },
        () => showError(topRatedGrid, 'Failed to load top-rated movies')
    );

    loadMovies(
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`,
        (results) => {
            allPopularMovies = results;
            renderMovies(popularGrid, results.slice(0, 4));
        },
        () => showError(popularGrid, 'Failed to load popular movies')
    );

    setupToggle(
        document.getElementById('see-all-btn'),
        recommendedGrid
    );

    setupToggle(
        document.getElementById('see-all-toprated-btn'),
        topRatedGrid,
        () => renderMovies(topRatedGrid, allTopRatedMovies),
        () => renderMovies(topRatedGrid, allTopRatedMovies.slice(0, 4))
    );

    setupToggle(
        document.getElementById('see-all-popular-btn'),
        popularGrid,
        () => renderMovies(popularGrid, allPopularMovies),
        () => renderMovies(popularGrid, allPopularMovies.slice(0, 4))
    );
});

