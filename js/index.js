

// 7. FETCH FOR POPULAR BANNER

async function fetchPopularBanner() {
    const res = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=4113f3ad734e747a5b463cde8c55de42&language=en-US&page=2`
    );
    const data = await res.json();

    // Find movie by ID
    const movie = data.results.find(m => m.id === 803796);

    if (!movie) {
        console.error("Movie ID 803796 not found!");
        return;
    }

    renderPopularMovie(movie);

}

function renderPopularMovie(movie) {
    // MATCH HTML IDs
    const title_banner_popular = document.getElementById("k-pop");
    const rating = document.getElementById("movie-rating-popular");
    const overview = document.getElementById("popular-movie-overview");

    // Fill UI
    title_banner_popular.textContent = movie.title;
    rating.innerHTML = `
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star-half-stroke"></i>
        <span class="text-white text-sm ml-2">${(movie.vote_average/2).toFixed(1)}</span>
    `;

    overview.textContent = movie.overview || "--";

    // Trailer button
    const buttonPopularTrailer = document.getElementById("popular-banner-trailer");
    buttonPopularTrailer.addEventListener('click', () => {
    // Open the trailer link in a new tab
    window.location.href = 'http://127.0.0.1:5500/pages/detail.html?movieId=803796';
});
}



// 8. FETCH FOR TOP RATING BANNER

async function fetchTopRatingBanner() {
    const res = await fetch(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=4113f3ad734e747a5b463cde8c55de42&language=en-US&page=1`
    );
    const data = await res.json();

    // Find movie by ID
    const movie = data.results.find(m => m.id === 1084242);

    if (!movie) {
        console.error("Movie ID 967941 not found!");
        return;
    }

    renderTopRatingMovie(movie);

}

function renderTopRatingMovie(movie) {
    // MATCH HTML IDs
    const title_banner_topRate = document.getElementById("top-rate-title");
    const rating = document.getElementById("movie-rating-topRate");
    const overview = document.getElementById("top-rate-overview");

    // Fill UI
    title_banner_topRate.textContent = movie.title;
    rating.innerHTML = `
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star-half-stroke"></i>
        <span class="text-white text-sm ml-2">${(movie.vote_average/2).toFixed(1)}</span>
    `;

    overview.textContent = movie.overview || "--";

    // Trailer button
    const buttonTopRateTrailer = document.getElementById("topRate-banner-trailer");
    buttonTopRateTrailer.onclick = () => {
        window.location.href = `./detail.html?movieId=${movie.id}`;
    };
}

// Start
fetchTopRatingBanner();


// Start
fetchPopularBanner();
