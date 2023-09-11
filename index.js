const colors = {
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
const mainTypes = Object.keys(colors)
const pokedexContainer = document.querySelector('.pokedexContainer');
const nextPage = document.querySelector('.nextPage').addEventListener('click', () => {
    fetchPokemons();
})

const fetchPokemons = async () => {
    const data = await nextPagePokemon(limit, page);
    page += limit;
    
    if(data.next === null){        
        console.log('final da página')
        return;
    } 

    for(let i = 0; i < data.results.length; i++){
        const pokemon = await getPokemon(data.results[i].url);
        createPokemon(pokemon);
    }
    
}

const nextPagePokemon = async (limit = 20, page = 0) => {
    const url = `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${page}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

const getPokemon = async (urlPokemon) => {
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
    const type = mainTypes.find(type => pokeTypes.indexOf(type) > -1);
    const color = colors[type];
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
    pokedexContainer.appendChild(card);
    console.log(name, id, pokeTypes, type);
}

window.addEventListener('load', () => {
    fetchPokemons();
})
