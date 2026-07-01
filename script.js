const pokemonContainer = document.getElementById("pokemonContainer");
const pokemonList = document.getElementById("pokemonList");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const randomBtn = document.getElementById("randomBtn");
const resetBtn = document.getElementById("resetBtn");
const typeSelect = document.getElementById("typeSelect");

const BASE_URL = "https://pokeapi.co/api/v2";

// Search button
searchBtn.addEventListener("click", () => {
    const pokemon = searchInput.value.toLowerCase().trim();

    if(pokemon !==""){
        getPokemon(pokemon);
    }
});

// Random button
randomBtn.addEventListener("click", () => {
    const randomId = Math.floor(Math.random() * 151) + 1;
    getPokemon(randomId);
});

// Reset button
resetBtn.addEventListener("click", () => {
    searchInput.value = "";
    typeSelect.value = "";
    pokemonContainer.innerHTML = "";
    loadPokemon();
});

//Press Enter
searchInput.addEventListener("keydown",(event)=>{
    if(event.key === "Enter"){
        searchBtn.click();
    }
});

// Fetch one Pokemon
async function getPokemon(name){

    pokemonContainer.innerHTML = `<div class="loader"></div>`;

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

//fetch the pokemon and scroll to the top of the page
async function getPokemonAndScroll(name) {
    await getPokemon(name);
    pokemonContainer.scrollIntoView({ behavior: "smooth", block: "start" 
    });
}

// Display selected Pokemon
function displayPokemon(pokemon) {
  const name =
  pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  const types = pokemon.types.map(type =>
    `<span class="type ${type.type.name}">${type.type.name}</span>`
  ).join("");

  const abilities = pokemon.abilities.map(ability =>
    ability.ability.name)
    .join(", ")
  ;

  const stats = pokemon.stats.map(stat => `
    <p>
    <strong>${stat.stat.name}</strong>
    </p>
    <progress
    value="${stat.base_stat}" max="255"></progress>`)
    .join("");

    const mainType = pokemon.types[0].type.name;
    pokemonContainer.className = mainType;

    pokemonContainer.innerHTML = `
    <h2>${name}</h2>
    <img
    src="${pokemon.sprites.other["official-artwork"].front_default}"
    alt="${pokemon.name}">

    <p><strong>ID:</strong> ${pokemon.id}</p>
    <p><strong>Height:</strong> ${pokemon.height}</p>
    <p><strong>Weight:</strong> ${pokemon.weight}</p>
    <p><strong>Abilities:</strong> ${abilities}</p>
    <p><strong>Types:</strong></p>
    ${types}
    <h3>Stats</h3>
    ${stats}
    `;
}

// Load first 151 Pokemon
async function loadPokemon() {
    const response = await fetch(`${BASE_URL}/pokemon?limit=151`);
    const data = await response.json();
    pokemonList.innerHTML="";
    
   for (const pokemon of data.results) {
    const response = await fetch(pokemon.url);
    const details = await response.json();
    pokemonList.innerHTML += `
    <div
    class="card" onclick="getPokemon('${details.name}')">
    <img
    src="${details.sprites.other["official-artwork"].front_default}"
    alt="${details.name}">
    <h3>${details.name}</h3>
    </div>
    `;
   }
}

async function loadTypes() {
    const response = await fetch(`${BASE_URL}/type`);
    const data = await response.json();
    data.results.forEach(type => {
        if (type.name !== "unknown" && type.name !== "shadow") {
            typeSelect.innerHTML += `<option value="${type.name}">${type.name}</option>`;
        }
    });
}

typeSelect.addEventListener("change", () => {
    if (typeSelect.value === "") {
        loadPokemon();
    } else {
        loadType(typeSelect.value);
    }
});

async function loadType(type) {
    pokemonList.innerHTML = "";
    const response = await fetch(`${BASE_URL}/type/${type}`);
    const data = await response.json();
    for (const pokemon of data.pokemon) {
        const response = await fetch(pokemon.pokemon.url);
        const details = await response.json();
        if (details.id <= 151) {
            pokemonList.innerHTML += `
            <div
            class="card" onclick="getPokemon('${details.name}')">
            <img
            src="${details.sprites.other["official-artwork"].front_default}"
            alt="${details.name}">
            <h3>${details.name.charAt(0).toUpperCase() + details.name.slice(1)}</h3>
            </div>
            `;
        }
    }
}

loadPokemon();
loadTypes();
