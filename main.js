addEventListener('DOMContentLoaded', () => {

    ///declaración de atributos a usar
    const character_container = document.getElementById('character_container');
    const searchForm = document.querySelector('#search-form');
    const buttons = document.querySelectorAll('.filterButton');
    console.log(buttons.length);
    const types = {
        Dead: { color: '#aa0223', fontcolor: '#000000'},
        Alive: { color: '#16be00', fontcolor:'#000000'},
        unknown: { color: '#e3fc00', fontcolor:'#000000'},
    };

    let currentPage=1
    let url="https://rickandmortyapi.com/api/character/?"


    searchForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const query = this.elements.query.value;
        url = "https://rickandmortyapi.com/api/character/?" + `name=${query}`+"&"
        const response = await fetch(url);
        const data = await response.json();
        refreshPage(data.results)
        renderPagination(data.info.pages)
    });

    buttons.forEach( button =>{
        button.addEventListener("click",filterResults)
    })

    function filterResults(event){
        if(event.target.name==="none"){
            fetch(url)
                .then(response => response.json())
                .then(data =>{
                    console.log("entro fetch")
                    refreshPage(data.results);
                    renderPagination(data.info.pages)
                })
        }else {
            fetch(url + "status=" + event.target.name+"&")
                .then(response => response.json())
                .then(data =>{
                    console.log("entro fetch")
                    refreshPage(data.results);
                    renderPagination(data.info.pages)
                })
        }

    }

    async function getCharacters() {
        const response = await fetch('https://rickandmortyapi.com/api/character');
        return response.json();
    }

    function createCharacterCard(character){
        const character_element = document.createElement('div');
        character_element.classList.add('character-card');
        const name = character.name;
        const color = types[character.status].color;
        const fontcolor = types[character.status].fontcolor;
        character_element.style.backgroundColor = color;
        character_element.style.color = fontcolor;
        character_element.innerHTML = `
            <div role="listitem">
                   <div class="image-container" >
                       <img loading="lazy" src="${character.image}" alt="${name} image"/>
                   </div>
                   <div class ="info">
                       <h2 class="name">${name}</h2>
                       <span class="number">#${character.id.toString().padStart(3, '0')}</span>
                   </div>
                   <div class="character-status">
                       <h3>${character.status}</h3>
                   </div>
            </div>
        `;
        character_container.appendChild(character_element);
    }
    function limpiarHTML(html){
        html.innerHTML='';
    };
    function refreshPage(character_list){
        limpiarHTML(character_container)
        for (let i=0 ; i<character_list.length ; i++){
            createCharacterCard(character_list[i])
        }
    }

    function renderPagination(totalPages) {
        // Crear botones de paginación
        const pagination = document.getElementById("pagination");
        pagination.innerHTML = ""; // Limpiar botones anteriores
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement("button");
            button.textContent = i;
            button.onclick = () => {
                // Manejar evento de clic para enviar solicitud HTTP a la API y actualizar los resultados
                currentPage = i;
                fetch(url + "page=" + currentPage+"&")
                    .then(response => response.json())
                    .then(data => refreshPage(data.results));
            };
            pagination.appendChild(button);
        }
    }

    getCharacters().then( data => {
        const character_list = data.results
        for (let i=0 ; i<character_list.length ; i++){
            createCharacterCard(character_list[i])
        }
        renderPagination(data.info.pages)
    })

})