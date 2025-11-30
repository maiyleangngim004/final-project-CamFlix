
(function () {
  const API_KEY = '4113f3ad734e747a5b463cde8c55de42';
  const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

  let currentPage = 1;
  let totalPages = 1;
  let totalResults = 0;

  document.addEventListener('DOMContentLoaded', () => {

    // Get the grid container
    const gridParent = document.getElementById('explored-container');
    if (!gridParent) return;

    // Build an empty grid
    const exploredGrid = document.createElement('div');
    exploredGrid.id = 'explored-grid';
    exploredGrid.className = 'grid grid-cols-2 md:grid-cols-5 gap-8 mt-5 px-4';
    exploredGrid.innerHTML = '<div class="col-span-full text-center text-gray-400 py-10">Loading movies...</div>';

    gridParent.innerHTML = '';
    gridParent.appendChild(exploredGrid);

    // Hook pagination controls
    setupPaginationListeners();

    loadPage(currentPage);
  });

  // ------------------------------
  // FETCH ONE PAGE OF MOVIES
  // ------------------------------
  async function loadPage(page) {
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`;

    try {
      const res = await fetch(url);
      const json = await res.json();

      currentPage = json.page;
      totalPages = json.total_pages;
      totalResults = json.total_results;

      renderExploredMovies(json.results);
      updatePaginationUI();

    } catch (err) {
      console.error('Failed to load movies', err);
      const g = document.getElementById('explored-grid');
      g.innerHTML = '<div class="col-span-full text-center text-red-500 py-10">Failed to load movies</div>';
    }
  }

  // ------------------------------
  // RENDER MOVIE CARDS
  // ------------------------------
  function renderExploredMovies(movies) {
    const grid = document.getElementById('explored-grid');
    grid.innerHTML = '';

    movies.forEach(movie => {
      const card = document.getElementById('movie-card-template-explored').content.cloneNode(true);
      const cardElement = card.querySelector('.movie-card');
      const img = card.querySelector('img');
      const title = card.querySelector('.movie-title');
      const genre = card.querySelector('.movie-genre');
      const rating = card.querySelector('.movie-rating');

      cardElement.dataset.movieId = movie.id;
      img.src = movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : 'https://placehold.co/500x750?text=No+Image';
      img.alt = movie.title;
      title.textContent = movie.title;
      genre.textContent = movie.release_date || 'No date available';
      rating.textContent = movie.vote_average?.toFixed(1) ?? 'N/A';

      cardElement.addEventListener('click', () => {
        window.location.href = `./detail.html?movieId=${movie.id}`;
      });

      grid.appendChild(card);
    });
  }

  // ------------------------------
  // SETUP PAGINATION BUTTON EVENTS
  // ------------------------------
  function setupPaginationListeners() {
    // Desktop previous button (first a in nav)
    const prevBtn = document.querySelector('nav[aria-label="Pagination"] a.pagination-prev');
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage > 1) loadPage(currentPage - 1);
      });
    }

    // Desktop next button (last a in nav)
    const nextBtn = document.querySelector('nav[aria-label="Pagination"] a.pagination-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage < totalPages) loadPage(currentPage + 1);
      });
    }

    // Page number links (data-page attribute)
    document.querySelectorAll('nav[aria-label="Pagination"] a.pagination-number').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const pageNum = parseInt(link.dataset.page);
        if (pageNum && pageNum !== currentPage) {
          loadPage(pageNum);
        }
      });
    });
  }

  // ------------------------------
  // UPDATE PAGINATION TEXT + BUTTON STATES
  // ------------------------------
  function updatePaginationUI() {
    // Update Showing X to Y of Z results
    const showingText = document.getElementById('pagination-info');
    if (showingText) {
      const start = (currentPage - 1) * 20 + 1;
      const end = Math.min(currentPage * 20, totalResults);
      showingText.innerHTML = `
        Showing <span class="font-medium">${start}</span>
        to <span class="font-medium">${end}</span>
        of <span class="font-medium">${totalResults}</span> results
      `;
    }

    // Highlight correct page number
    const pageLinks = document.querySelectorAll('nav[aria-label="Pagination"] a.pagination-number');
    pageLinks.forEach(link => {
      const pageNum = parseInt(link.dataset.page);
      if (pageNum === currentPage) {
        link.classList.add('bg-indigo-500', 'text-white', 'z-10');
        link.classList.remove('text-gray-200');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('bg-indigo-500', 'text-white', 'z-10');
        link.classList.add('text-gray-200');
        link.removeAttribute('aria-current');
      }
    });
  }

})();

