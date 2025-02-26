<script setup>
import { defineEmits } from "vue";

defineProps({
    pokemon: Object
});
defineEmits(["handleSelectPokemon"]);

</script>

<template>
<div class="item" @click="$emit('handleSelectPokemon', pokemon)">
    <div class="item__id"># {{ pokemon.id }}</div>
    <div
        class="item__image"
        :style="`background-image: url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png')`"
    ></div>
    <div class="item__name">{{ pokemon.name }}</div>
    <div class="types">
            <span 
                v-for="(type, index) in pokemon.types" 
                :key="index" 
                :class="['types__item', `${type}`]"
            >
                {{ type }}
            </span>
        </div>
    
</div>
</template>