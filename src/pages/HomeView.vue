<script setup>
import { onMounted, ref, computed } from "vue";
import { fetchAPI, getIDPokemon } from "@/utils";
import PokemonItem from "@/components/PokemonItem.vue";
import LoadMore from "@/components/LoadMore.vue";

let allPokemons = ref([]);
let displayedPokemons = ref([]);
const searchQuery = ref("");  // Thêm biến search
const offset = ref(0);
const batchSize = 36;

const getPokemon = async () => {
    const cachedPokemons = localStorage.getItem("allPokemons");

    if (cachedPokemons) {
        allPokemons.value = JSON.parse(cachedPokemons);
        filterPokemons(); // Gọi filterPokemons khi có dữ liệu
        return;
    }

    const response = await fetchAPI("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=300");
    const pokemonList = response.results.map(pokemon => ({
        name: pokemon.name,
        id: getIDPokemon(pokemon.url),
        url: pokemon.url
    }));

    allPokemons.value = pokemonList;
    localStorage.setItem("allPokemons", JSON.stringify(pokemonList));
    filterPokemons();
};

const filterPokemons = () => {
    if (!searchQuery.value.trim()) {
        displayedPokemons.value = allPokemons.value.slice(0, batchSize);
    } else {
        displayedPokemons.value = allPokemons.value.filter(pokemon =>
            pokemon.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        ).slice(0, batchSize);
    }
    offset.value = 0;
};

// Theo dõi `searchQuery` và cập nhật danh sách
const filteredPokemons = computed(() => {
    return allPokemons.value.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

const handleLoadMore = () => {
    offset.value += batchSize;
    const nextBatch = filteredPokemons.value.slice(offset.value, offset.value + batchSize);
    displayedPokemons.value = [...displayedPokemons.value, ...nextBatch];
};

const handleSelectPokemon = (pokemon) => {
    localStorage.setItem("selectedPokemon", JSON.stringify(pokemon));
};

onMounted(getPokemon);
</script>

<template>
    <div class="container">
        <!--Title-->
        <div class="title">
                <p class="title__main">Pokemon API</p>
                <input class="title__input" @input="filterPokemons" type="text" v-model="searchQuery" placeholder="Search some Pokemon...">
            </div>
            <!--End Title-->

        <div class="items">
            <router-link
                v-for="(pokemon, index) in displayedPokemons"
                :key="index"
                :to="`/${pokemon.id}`" 
                @click="handleSelectPokemon(pokemon)"
            >
                <PokemonItem :pokemon="pokemon" />
            </router-link>
        </div>
        <LoadMore v-if="displayedPokemons.length < filteredPokemons.length" @handleLoadMore="handleLoadMore"/>
    </div>
</template>

<style>
*{
    color: #2c3e50;
    text-decoration: none;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    font-family: "Inter", sans-serif;
}

.container{
    margin: 0 auto;
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 50px;
}
.title{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 70px 0;
}
.title__main{
    color: #2c3e50;
    font-size: 37.5px;
    line-height: 60px;
    margin-bottom: 30px;
    font-weight: 400;
}
.title__input{
    width: 500px;
    padding: 20px;
    background-color: #fff;
    border-radius: 30px;
    font-family: "Arial", sans-serif;
    box-shadow: #64646f33 0px 7px 29px 0px;
    border: grey solid 1px;
}
.items{
    width: 100%;
    display: grid;
    grid-template-columns: repeat(6, 15.87%);
    gap: 10px;
    padding: 0 10px;
}
.item{
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    width: 100%;
    line-height: 24px;
    padding: 10px 5px;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
    transition: all .4s ease-in;
    cursor: pointer;
    background-repeat: no-repeat;
    background-size: cover;
}   
.item:hover{
    box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px;
}
.item__id{
    color: #2c3e50;
    font-size: 15px;
    line-height: 24px;
    text-align: center;
}   
.item__image{
    width: 100%;
    aspect-ratio: 1 / 1;
    background-size: contain;
    background-repeat: no-repeat;
    padding: 179.913px 0px 0px;
}
.item__name{
    font-size: 17.55px;
    font-weight: 700;
    line-height: 28.08px;
    text-align: center;
    text-transform: capitalize;
}
.types{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
}
.types__item{
    font-size: 13px;
    border-radius: 5px;
    font-weight: 500;
    line-height: 20.8px;
    margin: 4px 3px;
    padding: 3px 4px;
    text-transform: capitalize;
}
.normal {
    background-color: #a8a77a; 
}

.fire {
    background-color: #ff421c; 
}

.water {
    background-color: #6390f0; 
}

.grass {
    background-color: #78cd54;
}

.electric {
    background-color: #f7d02c; 
}

.ice {
    background-color: #96d9d6; 
}

.fighting {
    background-color: #c22e28; 
}

.poison {
    background-color: #a33ea1; 
}

.ground {
    background-color: #e2bf65; 
}

.flying {
    background-color: #a98ff3; 
}

.psychic {
    background-color: #f95587;
}

.bug {
    background-color: #a6b91a; 
}

.rock {
    background-color: #b6a136; 
}

.ghost {
    background-color: #735797; 
}

.dragon {
    background-color: #6f35fc; 
}

.dark {
    background-color: #705746; 
}

.steel {
    background-color: #b7b7ce; 
}

.fairy {
    background-color: #d685ad; 
}
.load-more{
    background-color: #ff4d4f;
    border-radius: 10px;
    color: #fff;
    padding: 20px 25px;
    text-align: center;
    border: none;
    margin-top: 20px;
    margin-bottom: 20px;
    cursor: pointer;
}
@media screen and (max-width: 1199px) {
    .items{
        display: grid;
        grid-template-columns: repeat(4, 24.375%);
    }
}

@media screen and (max-width: 956px) {
    .items{
        display: grid;
        grid-template-columns: repeat(3, 32.77%);
    }
}

@media screen and (max-width: 768px) {
    .items{
        display: grid;
        grid-template-columns: repeat(2, 49.58%);
    }
}



</style>