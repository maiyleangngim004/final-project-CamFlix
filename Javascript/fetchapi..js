 const apiKey = "4113f3ad734e747a5b463cde8c55de42"; // your API key
    const imageBaseURL = "https://image.tmdb.org/t/p/w500";
    let currentPage = 1;

    const moviesGrid = document.getElementById("movies-grid");
    const loadMoreBtn = document.getElementById("load-more");
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");

    
   
    function fetchPopularMovies(page = 1) {
      fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${page}`)
        .then(res => res.json())
        .then(data => {
          data.results.forEach(movie => {
            const card = document.createElement("div");
            

            card.classList.add("card", "dark:text-white", "text-black");

           

            card.innerHTML = `
              <div>
                <a href="#">
                  <img class="w-[291px] h-[376px] object-cover mx-auto rounded-3xl transform transition-transform duration-300 hover:scale-95 "
                       src="${imageBaseURL + movie.poster_path}" alt="${movie.title}">
                </a>
              </div>
              <div class="mt-2 mb-2 flex justify-around items-start">
                <div>
                  <span class="font-semibold text-[20px] line-clamp-1">${movie.title}</span>
                  <p class="text-[16px]">Release: ${movie.release_date}</p>
                </div>
                <span class="text-[18px] mt-1 flex items-center gap-1.5 text-yellow-400">
                  <i class="fa-solid fa-star"></i>
                  <span>${movie.vote_average}</span>
                </span>
              </div>
            `;
            moviesGrid.appendChild(card);
          });
        })
        .catch(err => console.error("Error fetching movies:", err));
    }
 
    fetchPopularMovies(currentPage);

    
    loadMoreBtn.addEventListener("click", () => {
      currentPage++;
      fetchPopularMovies(currentPage);
    });
