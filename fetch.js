let pageNumber = 1;
let processedMovies = []; // Array para evitar duplicados

// Función para hacer fetch con timeout (similar a Promise.race)
function fetchWithTimeout(url, timeout = 5000) {
    return Promise.race([
        fetch(url).then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        }),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), timeout)
        )
    ]);
}

// Función para realizar la petición principal
async function Request() {
    const theme = document.getElementById('themes').value;
    const url = `http://www.omdbapi.com/?apikey=2670eda&s=${theme}&page=${pageNumber}`;

    try {
        const searchResponse = await fetchWithTimeout(url);

        if (searchResponse.Search) {
            // Crear promesas para todas las películas
            const moviePromises = searchResponse.Search.map(async (movie) => {
                // Verificar si el ID ya fue procesado
                if (processedMovies.includes(movie.imdbID)) {
                    return null; // Ignorar duplicados
                }

                // Agregar a la lista de procesados
                processedMovies.push(movie.imdbID);

                const urlDetail = `http://www.omdbapi.com/?apikey=2670eda&i=${movie.imdbID}`;
                const detailResponse = await fetchWithTimeout(urlDetail);

                return detailResponse;
            });

            // Resolver todas las promesas
            const movies = await Promise.all(moviePromises);

            // Renderizar las películas
            movies.forEach((movie) => {
                if (movie && movie.Genre.includes(theme)) {
                    let div = document.createElement('div');
                    div.classList.add('card', 'mb-3');
                    div.style.width = '18rem';

                    div.innerHTML = `
                        <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title}">
                        <div class="card-body">
                            <h5 class="card-title">${movie.Title}</h5>
                            <p class="card-text">Género: ${movie.Genre}</p>
                        </div>
                    `;

                    document.getElementById('moviesGrid').appendChild(div);
                }
            });

            pageNumber++;
        }
    } catch (error) {
        console.error("Error al cargar películas:", error);
    }
}

// Función para recargar resultados en varias páginas
async function reload() {
    let i = 0;
    while (i < 4) {
        await Request(); // Esperar a que termine cada iteración
        i++;
    }
}

// Función para buscar una película específica
async function RequestSimple() {
    const title = document.getElementById('title').value;
    const url = `http://www.omdbapi.com/?t=${title}&apikey=2670eda`;

    try {
        const response = await fetchWithTimeout(url);
        let div = document.createElement('div');
        div.classList.add('card', 'mb-3');

        div.innerHTML = `
            <img src="${response.Poster}" class="card-img-top" alt="${response.Title}">
            <div class="card-body">
                <h5 class="card-title">${response.Title}</h5>
                <p class="card-text">Género: ${response.Genre}</p>
            </div>
        `;

        document.getElementById('moviesGrid').appendChild(div);
    } catch (error) {
        console.error("Error al cargar la película:", error);
    }
}

// Inicializar eventos
let movies = document.getElementById('moviesGrid');
let btnSend = document.getElementById('send');
let btnSearch = document.getElementById('search');

window.onload = function () {
    btnSend.addEventListener('click', reload);
    btnSearch.addEventListener('click', RequestSimple);
};
