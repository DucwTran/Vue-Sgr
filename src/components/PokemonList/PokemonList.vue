<script setup>
import { ref, onMounted, computed } from "vue";
import { fetchAPI, getIDPokemon } from "../../utils";
import PokemonItem from "../PokemonItem/PokemonItem.vue";
import LoadMore from "../LoadMore/LoadMore.vue";

const allPokemons = ref([]); // Danh sách tất cả Pokémon
const displayedPokemons = ref([]); // Danh sách Pokémon hiển thị khi không tìm kiếm
const batchSize = 36; // Số lượng Pokémon mỗi lần load
const offset = ref(0); // Offset của danh sách hiển thị khi không tìm kiếm
const displayLimit = ref(batchSize); // Giới hạn số Pokémon hiển thị khi tìm kiếm
const loading = ref(false);

const props = defineProps({
    searchQuery: String, // Thêm props này để Vue không cảnh báo
});
console.log(props.searchQuery)

const fetchPokemons = async () => {
    if (loading.value) return;
    loading.value = true;
    try {
        let url = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=300"; // Lấy tất cả Pokémon
        const response = await fetchAPI(url);
        allPokemons.value = response.results.map((pokemon) => ({
            name: pokemon.name,
            id: getIDPokemon(pokemon.url),
        }));
        
        // Hiển thị batch đầu tiên
        displayedPokemons.value = allPokemons.value.slice(0, batchSize);
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu Pokemon:", error);
    } finally {
        loading.value = false;
    }
};
// Lọc danh sách Pokémon theo searchQuery
const filteredPokemons = computed(() => {
    if (!props.searchQuery) {
        return displayedPokemons.value;
    }
    return allPokemons.value
        .filter(pokemon => pokemon.name.toLowerCase().includes(props.searchQuery.toLowerCase())).slice(0, displayLimit.value); // Chỉ lấy số Pokémon theo displayLimit
});

const loadMore = () => {
    if (loading.value) return; // tránh gây lỗi khi đang load mà bấm thêm
    loading.value = true;

    if (props.searchQuery) {
        // Khi tìm kiếm, tăng displayLimit để hiển thị thêm 36 kết quả
        displayLimit.value += batchSize;
    } else {
        // Khi không tìm kiếm, tiếp tục lấy Pokémon từ danh sách gốc
        const nextOffset = offset.value + batchSize;
        const nextBatch = allPokemons.value.slice(offset.value, nextOffset);
        displayedPokemons.value.push(...nextBatch);
        offset.value = nextOffset;
    }

    loading.value = false;
};

onMounted(fetchPokemons);
</script>

<template>
    <div class="items"> 
        <PokemonItem 
            v-for="(pokemon, index) in filteredPokemons" 
            :key="index" 
            :pokemon="pokemon" 
        />
    </div>
    <LoadMore :loading="loading" @load-more="loadMore" v-if="offset + batchSize < allPokemons.length" />
</template>