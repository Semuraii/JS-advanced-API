const pokemonContainer = document.getElementById("pokemonContainer");
const pokemonList = document.getElementById("pokemonList");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const randomBtn = document.getElementById("randomBtn");
const resetBtn = document.getElementById("resetBtn");

const BASE_URL = "https://pokeapi.co/api/v2";

// Search button
searchBtn.addEventListener("click", () => {
    const pokemon = searchInput.value.toLowerCase().trim();

    if(pokemon !==""){
        getPokemon(pokemon);
    }
});

//Press Enter
searchInput.addEventListener("keydown",(event)=>{
    if(event.key === "Enter"){
        searchBtn.click();
    }
});

// Fetch one Pokemon
async function getPokemon(name){
    try{
        const response = await fetch(`${BASE_URL}/pokemon/${name}`);
        if(!response.ok){
            throw new Error("Pokemon not found");
        }
        const data = await response.json();
        displayPokemon(data);
    }
    catch(error){
        pokemonContainer.innerHTML = `
        <h2>${error.message}</h2>
        `;
    } 
}

// Display selected Pokemon
function displayPokemon(pokemon){
    const types = pokemon.types
    .map(type => `<span class="type ${type.type.name}">${type.type.name}</span>`)
    .join("");

    pokemonContainer.innerHTML = `
    <h2>${pokemon.name.toUpperCase()}</h2>
    <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}">
    <p><strong>ID:</strong> ${pokemon.id}</p>
    <p><strong>Height:</strong> ${pokemon.height}</p>
    <p><strong>Weight:</strong> ${pokemon.weight}</p>
    <p><strong>Types:</strong> ${types}</p>
    `;
}

// Load first 151 Pokemon
async function loadPokemon() {
    const response = await fetch(`${BASE_URL}/pokemon?limit=151`);
    const data = await response.json();
    pokemonList.innerHTML="";
    
    data.results.forEach(async pokemon=> {
        const response = await fetch(pokemon.url);
        const details = await response.json();
        
        pokemonList.innerHTML += `
        <div class="card" onclick="getPokemon('${details.name}')">
        <img src="${details.sprites.other["official-artwork"].front_default}" alt="${details.name}">
        <h3>${details.name}</h3>
        </div>
        `;
    });
}

loadPokemon();