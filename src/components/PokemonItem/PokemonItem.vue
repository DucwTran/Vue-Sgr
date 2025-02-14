
<script>
export default {
    props: {
        pokemon: Object,
    },
};
</script>

<template>
<div class="item">
    <div class="item__id"># {{ pokemon.id }}</div>
    <div
        class="item__image"
        :style="`background-image: url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png')`"
    ></div>
    <div class="item__name">{{ pokemon.name }}</div>
</div>
</template>