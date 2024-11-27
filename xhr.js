function RequestSimple() {
    let xhr = new XMLHttpRequest();
    let title = document.getElementById('title').value;

    let url = `http://www.omdbapi.com/?t=${title}&apikey=2670eda`;

    xhr.open("GET",url, true);

    xhr.responseType = 'json';

    xhr.onload = function () {
        if (xhr.status === 200) {
            let div = document.createElement('div');
            div.classList.add('card', 'mb-3');
           
    
            div.innerHTML = `
                <img src="${xhr.response.Poster}" class="card-img-top" alt="${xhr.response.Title}">
                <div class="card-body">
                    <h5 class="card-title">${xhr.response.Title}</h5>
                    <p class="card-text">Género: ${xhr.response.Genre}</p>
                </div>
            `;
    
            document.getElementById('moviesGrid').appendChild(div);
        } else {
            console.error('Error en la solicitud. Código de estado:', xhr.status);
        }
    };
    
    xhr.send();

}

let pageNumber = 1;

function Request(){
    let xhr = new XMLHttpRequest();
    let theme = document.getElementById('themes').value;

    let url = `http://www.omdbapi.com/?apikey=2670eda&s=${theme}&page=${pageNumber}`;

    xhr.open('GET', url, true);

    xhr.responseType = 'json';

    xhr.onload = () => {
        if (xhr.status === 200){
            let lista = xhr.response.Search;

            if (lista){
                lista.forEach(e => {
                    let xhrDetail = new XMLHttpRequest();

                    let urlDetail = `http://www.omdbapi.com/?apikey=2670eda&i=${e.imdbID}`;

                    xhrDetail.open('GET', urlDetail, true);

                    xhrDetail.responseType = 'json';

                    xhrDetail.onload = () => {
                        if (xhrDetail.status === 200) {
                            let datas = xhrDetail.response;
                    
                            if (datas.Genre.includes(theme)) {
                                let div = document.createElement('div');
                                div.classList.add('card', 'mb-3'); 
                                div.style.width = '18rem';
                    
                                div.innerHTML = `
                                    <img src="${datas.Poster}" class="card-img-top" alt="${datas.Title}">
                                    <div class="card-body">
                                        <h5 class="card-title">${datas.Title}</h5>
                                        <p class="card-text">Género: ${datas.Genre}</p>
                                    </div>
                                `;
                    
                                movies.appendChild(div);
                            }
                        }
                    };
                    
                    xhrDetail.send();

                });
                pageNumber++;
            }
        }
    }
    xhr.send();
}

function reload() {
    let i = 0;
    while (i < 4){
        Request();
        i++;
    }
}

let movies = document.getElementById('moviesGrid');
let btnSend = document.getElementById('send');
let btnSearch = document.getElementById('search');

window.onload = function() {
    btnSend.addEventListener('click', reload);
    btnSearch.addEventListener('click', RequestSimple);
}