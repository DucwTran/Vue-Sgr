<script>
import { fetchAPI, getIDPokemon } from '../../utils'; // Import thêm getIDPokemon
import PokemonItem from '../PokemonItem/PokemonItem.vue';

export default {
    name: "PokemonList",
    components: {
        PokemonItem
    },
    data() {
        return {
            pokemons: []
        };
    },
    async mounted() {
        try {
            const response = await fetchAPI("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=100");
            console.log(response);
            this.pokemons = response.map(pokemon => ({
                name: pokemon.name,
                id: getIDPokemon(pokemon.url) // 👉 Dùng getIDPokemon() để lấy ID từ URL
            }));
            console.log("Danh sách Pokémon:", this.pokemons);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu Pokémon:", error);
        }
    }
};
</script>

<template>
<div class="items">
        <PokemonItem 
            v-for="(pokemon, index) in pokemons" 
            :key="index" 
            :pokemon="pokemon" 
        />
</div>
</template>
