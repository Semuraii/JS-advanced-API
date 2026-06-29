const pokemonContainer = document.getElementById("pokemonContainer");
const pokemonList = document.getElementById("pokemonList");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

const BASE_URL = "https://pokeapi.co/api/v2";

// Search button
searchBtn.addEventListener("click", () => {
    const pokemon = searchInput.value.toLowerCase().trim();

    if(pokemon !==""){
        getPokemon(pokemon);
    }
});

//Press Enter
searchInput.addEventListener("kreypress",(event)=>{
    if(event.key==="Enter"){
        searchBtn.click();
    }
});

// Fetch one Pokemon
async function getPokemon(name){
    try{
        const response = await fetch(`${BASE_URL}/pokemon/${name}`);
        if(!response.ok){
            throw new WebTransportError("Pokemon not found");
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
    .map(type => type.type.name)
    .join(", ");

    pokemonContainer.innerHTML = `
    <h2>${pokemon.name.toUpperCase()}</h2>
    `
}