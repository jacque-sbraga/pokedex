const pokemonTypes = {
    fire: '#FDDFDF',
    grass: '#DEFDE0',
    electric: '#FCF7DE',
    water: '#DEF3FD',
    ground: '#f4e7da',
    rock: '#d5d5d4',
    fairy: '#fceaff',
    poison: '#98d7a5',
    bug: '#f8d5a3',
    dragon: '#97b3e6',
    psychic: '#eaeda1',
    flying: '#F5F5F5',
    fighting: '#E6E0D4',
    normal: '#F5F5F5',
    ghost: '#EEEEEE',
    dark: '#E3E3E3'
}
const limit = 30;
let page = 0;
const mainTypes = Object.keys(pokemonTypes);
const pokedexContainer = document.querySelector('.pokedexContainer');
const pokedex = document.querySelector('.pokedex');
const filter = document.querySelector('.pokeFilter');
const nextPage = document.querySelector('.nextPage').addEventListener('click', () => {
    fetchPokemons();
})

const fetchPokemons = async () => {
    const data = await nextPagePokemon(limit, page);
    page += limit;
    
    if(data.next !== null){        
        getPokemon(data.results);
    } 
}
// recebe um array de data
const getPokemon = async (dataArr) => {

    for(let data of dataArr){
        const pokemon = await fetchPokemon(data.url);
        createPokemon(pokemon);
    }
}

const nextPagePokemon = async (limit = 20, page = 0) => {
    const url = `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${page}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

const fetchPokemon = async (urlPokemon) => {
    const response = await fetch(urlPokemon);
    const data = await response.json();
    return data;
}

const createPokemon = (pokemon) => {
    const card = document.createElement('div');
    card.classList.add('pokemon');
    const name = pokemon.name.toUpperCase();
    const id = pokemon.id.toString().padStart(3, 0);
    const pokeTypes = pokemon.types.map(type => type.type.name);
    const type = pokeTypes.length > 1 ? `${pokeTypes[0]} | ${pokeTypes[1]}` :mainTypes.find(type => pokeTypes.indexOf(type) > -1) ;
    const color = pokemonTypes[type];
    card.style.backgroundColor = color;

    const pokemonInnerHtml = `
        <div class="imgContainer">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" alt=${name}>
        </div>
        <div class="info">
            <span class="number">#${id}</span>
            <h3 class="name">${name}</h3>
            <small class="type">Type: <span>${type}</span></small>
        </div>
    `

    card.innerHTML = pokemonInnerHtml;
    pokedex.appendChild(card);
}

const fetchType = async (typeName) => {
    const data = await fetch(`https://pokeapi.co/api/v2/type/${typeName}`);
    const pokemonList = await data.json();
    let pokemonsArr = [...pokemonList.pokemon];

    pokemonsArr = pokemonsArr.map(data => ({name: data.pokemon.name, url:data.pokemon.url}))
    pokedex.innerHTML = '';
    
    getPokemon(pokemonsArr);
}

const pokeFilter = () => {
    for(let pokeType in pokemonTypes){
        const type = document.createElement('span');
        type.style.backgroundColor = pokemonTypes[pokeType];
        type.innerText = pokeType;
        type.className = 'btn-filter';
        filter.appendChild(type);
    }
}

window.addEventListener('load', () => {
    fetchPokemons();
    pokeFilter();
});

pokedexContainer.addEventListener('click', (e) => {
    const { target } = e;
    const { className } = target
    
    if(className === 'btn-filter'){
        fetchType(target.innerText);
        
    }
})
