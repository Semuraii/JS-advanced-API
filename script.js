const pokemonContainer = document.getElementById("pokemonContainer");
const pokemonList = document.getElementById("pokemonList");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

const BASE_URL = "https://pokeapi.co/api/v2";

searchBtn.addEventListener("click", () => {
    const pokemon = searchInput.value.toLowerCase().trim();

    if(pokemon !==""){
        getPokemon(pokemon);
    }
});