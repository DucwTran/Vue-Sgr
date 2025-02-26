import { createRouter, createWebHistory } from "vue-router";
import PokemonDetail from "../pages/PokemonDetail.vue";
import HomeView from "../pages/HomeView.vue";

const routes = [
    { path: "/", component: HomeView },
    { path: "/:id", component: PokemonDetail, props: true }, // Route động
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
