<script setup>
import { onMounted, ref, watch, defineEmits} from "vue";
import { fetchAPI, getIDPokemon } from "../../utils";
import PokemonItem from "../PokemonItem/PokemonItem.vue";
import LoadMore from "../LoadMore/LoadMore.vue";

const props = defineProps({
    searchQuery: String,
    isSelect: Boolean,
    selectedPokemon: Object
});
const emit = defineEmits([
    "update:isSelect",
    "update:selectedPokemon"
]);

const url = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=300";
let allPokemons = ref([]);
let displayedPokemons = ref([]);
let filteredPokemons = ref([]);
const offset = ref(0);
const batchSize = 36;

const getPokemonSlogan = async (pokemonId) => {
    try {
        const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`;
        const speciesData = await fetchAPI(speciesUrl);

        if (!speciesData || !speciesData.flavor_text_entries) {
            console.error("Không tìm thấy slogan!");
            return "No slogan available.";
        }
        // Tìm slogan tiếng Anh
        const englishEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === "en");

        return englishEntry ? englishEntry.flavor_text.replace(/\n|\f/g, " ") : "No slogan available.";
    } catch (error) {
        console.error("Lỗi khi lấy slogan:", error);
        return "No slogan available.";
    }
};
const getPokemonEvolutionChain = async (pokemonId) => {
    try {
        const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`;
        const pokemonData = await fetchAPI(pokemonUrl);
        if (!pokemonData || !pokemonData.species) {
            console.error("Không tìm thấy species của Pokémon!");
            return [];
        }

        // Lấy evolution_chain URL từ API pokemon-species/{id}/
        const speciesUrl = pokemonData.species.url;
        const speciesData = await fetchAPI(speciesUrl);
        if (!speciesData || !speciesData.evolution_chain) {
            console.error("Không tìm thấy chuỗi tiến hóa!");
            return [];
        }

        // Lấy danh sách tiến hóa từ API evolution-chain/{id}/
        const evolutionChainUrl = speciesData.evolution_chain.url;
        const evolutionData = await fetchAPI(evolutionChainUrl);
        if (!evolutionData || !evolutionData.chain) {
            console.error("Không tìm thấy dữ liệu tiến hóa!");
            return [];
        }

        // Trích xuất danh sách tiến hóa
        const extractEvolutionChain = (chain) => {
            const evolutions = [];
            let current = chain;
            while (current) {
                const speciesId = getIDPokemon(current.species.url);
                evolutions.push({ id: speciesId, name: current.species.name });
                current = current.evolves_to.length ? current.evolves_to[0] : null;
            }
            return evolutions;
        };

        return extractEvolutionChain(evolutionData.chain);
    } catch (error) {
        console.error("Lỗi khi lấy chuỗi tiến hóa:", error);
        return [];
    }
};

const getPokemon = async () => {
    const cachedPokemons = localStorage.getItem("allPokemons");

    if (cachedPokemons) {
        allPokemons.value = JSON.parse(cachedPokemons);
        filterPokemons();
        return;
    }
    const response = await fetchAPI(url);
    const pokemonList = response.results.map((pokemon) => ({
        name: pokemon.name,
        id: getIDPokemon(pokemon.url),
        url: pokemon.url
    }));

    const detailedPokemons = await Promise.all(
        pokemonList.map(async (pokemon) => {
            const details = await fetchAPI(pokemon.url);
            const slogan = await getPokemonSlogan(pokemon.id);
            const evolutionChain = await getPokemonEvolutionChain(pokemon.id);
            console.log(evolutionChain)
            return {
                ...pokemon,
                height: details.height,
                weight: details.weight,
                abilities: details.abilities.map(abi => abi.ability.name),
                types: details.types.map(t => t.type.name),
                slogan: slogan,
                stats: {
                    HP: details.stats.find(stat => stat.stat.name === "hp")?.base_stat || 0,
                    Attack: details.stats.find(stat => stat.stat.name === "attack")?.base_stat || 0,
                    Defense: details.stats.find(stat => stat.stat.name === "defense")?.base_stat || 0,
                    SpecialAttack: details.stats.find(stat => stat.stat.name === "special-attack")?.base_stat || 0,
                    SpecialDefense: details.stats.find(stat => stat.stat.name === "special-defense")?.base_stat || 0,
                    Speed: details.stats.find(stat => stat.stat.name === "speed")?.base_stat || 0
                },
                evolution_chain: evolutionChain
            };
        })
    );

    allPokemons.value = detailedPokemons;
    localStorage.setItem("allPokemons", JSON.stringify(detailedPokemons));
    filterPokemons();
};

const filterPokemons = () => {
    if (!props.searchQuery || props.searchQuery.trim() === "") {
        filteredPokemons.value = allPokemons.value;
    } else {
        filteredPokemons.value = allPokemons.value.filter(pokemon =>
            pokemon.name.toLowerCase().includes(props.searchQuery.toLowerCase())
        );
    }
    offset.value = 0;
    displayedPokemons.value = filteredPokemons.value.slice(0, batchSize);
};

watch(() => props.searchQuery, () => {
    filterPokemons();
});

const handleLoadMore = () => {
    offset.value += batchSize;
    const nextBatch = filteredPokemons.value.slice(offset.value, offset.value + batchSize);
    displayedPokemons.value = [...displayedPokemons.value, ...nextBatch];
};

const handleSelectPokemon = (pokemon) => {
    emit("update:isSelect", true);
    emit("update:selectedPokemon", pokemon); 
};

onMounted(getPokemon);
</script>

<template>
    <div class="items"> 
        <PokemonItem 
            v-for="(pokemon, index) in displayedPokemons" 
            :key="index" 
            :pokemon="pokemon" 
            @handleSelectPokemon="handleSelectPokemon"
        />
    </div>
    <LoadMore v-if="displayedPokemons.length < filteredPokemons.length" @handleLoadMore="handleLoadMore"/>
</template>