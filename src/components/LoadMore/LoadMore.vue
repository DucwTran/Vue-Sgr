<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
    loading: Boolean,
});

const emit = defineEmits(["load-more"]);
</script>

<template>
    <button
        class="load-more"
        @click="emit('load-more')"
        v-if="!props.loading"
    >Load more</button>
</template>