<script setup>
import { defineEmits } from "vue";


const emit = defineEmits(["handleLoadMore"]);
</script>

<template>
    <button
        class="load-more"
        @click="emit('handleLoadMore')"
    >Load more</button>
</template>