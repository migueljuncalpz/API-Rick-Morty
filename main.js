addEventListener('DOMContentLoaded', () => {
    const character_container = document.getElementById('character_container');
    const searchForm = document.querySelector('#search-form');
    const buttons = document.querySelectorAll('.filterButton');
    const types = {
        Dead: { color: '#aa0223', fontcolor: '#000000'},
        Alive: { color: '#16be00', fontcolor:'#000000'},
        unknown: { color: '#e3fc00', fontcolor:'#000000'},
    };
    let currentPage=1
    let url="https://rickandmortyapi.com/api/character/?"
    const debouncedRefresh = debounce(getCharacters,300)

    searchForm.addEventListener('input', async function(event) {
        event.preventDefault();
        const query = this.elements.query.value;
        url = "https://rickandmortyapi.com/api/character/?" + `name=${query}`+"&"
        debouncedRefresh(url)
    });
    buttons.forEach( button =>{
        button.addEventListener("click",filterResults)
    })
    function filterResults(event){
        let href = new URL(url);
        if(event.target.name==="none"){
            href.searchParams.delete("status")
            url = href.toString()
            getCharacters(url)
        }else {
            href.searchParams.delete("status")
            href.searchParams.append('status', event.target.name);
            url = href.toString()
            getCharacters(url)
        }
    }
    function getCharacters(url) {
        fetch(url)
            .then(response => response.json())
            .then(data =>{
                refreshPage(data.results);
                renderPagination(data.info.pages)
            })
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
    }
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
                let href = new URL(url);
                console.log("hola")
                href.searchParams.delete("page")
                href.searchParams.append('page', i);
                getCharacters(href.toString())
            };
            pagination.appendChild(button);
        }
    }

    getCharacters(url)
    function debounce(func, delay) {
        let timerId;
        return function (...args) {
            if (timerId) {
                clearTimeout(timerId);
            }
            timerId = setTimeout(() => {
                func.apply(this, args);
                timerId = null;
            }, delay);
        };
    }
})