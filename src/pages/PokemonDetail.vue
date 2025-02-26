<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute(); // Dùng để lấy `id` từ URL
const router = useRouter();
const pokemon = ref(null);

onMounted(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const storedPokemon = localStorage.getItem("selectedPokemon");

    if (storedPokemon) {
        pokemon.value = JSON.parse(storedPokemon);
    } else {
        const storedPokemons = JSON.parse(localStorage.getItem("allPokemons") || "[]");
        const foundPokemon = storedPokemons.find(p => p.id == route.params.id);

        if (foundPokemon) {
            pokemon.value = foundPokemon;
        } else {
            console.warn("No Pokémon found!");
            router.push("/"); // Nếu không có, quay về trang chính
        }
    }
});

</script>

<template>
    <div class="container" v-if="pokemon">
        <router-link to="/" class="back"> &lt; Back</router-link> 
        <div class="detail">
            <!-- Ảnh Pokémon -->
            <div 
                class="detail__img" 
                :style="`background-image: url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png')`">
            </div>

            <!-- Loại Pokémon -->
            <div class="detail__types">
                <div 
                    v-for="(type, index) in pokemon.types" 
                    :key="index" 
                    :class="['detail__types-item', type]"
                >
                    {{ type }}
                </div>
            </div>

            <h2 class="detail__name">{{ pokemon.name }}</h2>
            <p class="detail__talk">{{ pokemon.slogan }}</p>

            <!-- Chi tiết cơ bản -->
            <div class="detail__body">
                <div class="detail__body-col">
                    <span class="detail__body-label">Height</span>
                    <div class="detail__body-index">{{ pokemon.height }}</div>
                </div>
                <div class="detail__body-col">
                    <span class="detail__body-label">Weight</span>
                    <div class="detail__body-index">{{ pokemon.weight }}</div>
                </div>
            </div>

            <!-- Abilities -->
            <div class="detail__abilities">
                <h3 class="detail__abilities-title">Abilities</h3>
                <div class="detail__abilities-items">
                    <div 
                        v-for="(ability, index) in pokemon.abilities" 
                        :key="index" 
                        class="detail__abilities-item"
                    >
                        {{ ability }}
                    </div>
                </div>
            </div>

            <!-- Stats -->
            <div class="detail__stats">
                <h3 class="detail__stats-title">Stats</h3>
                <div class="detail__stats-items">
                    <div class="detail__stats-item">
                        <div class="detail__stats-item-tag hp">HP</div>
                        <span>{{ pokemon.stats?.HP || 0 }}</span>
                    </div>
                    <div class="detail__stats-item">
                        <div class="detail__stats-item-tag atk">ATK</div>
                        <span>{{ pokemon.stats?.Attack || 0 }}</span>
                    </div>
                    <div class="detail__stats-item">
                        <div class="detail__stats-item-tag def">DEF</div>
                        <span>{{ pokemon.stats?.Defense || 0 }}</span>
                    </div>
                    <div class="detail__stats-item">
                        <div class="detail__stats-item-tag spa">SPA</div>
                        <span>{{ pokemon.stats?.SpecialAttack || 0 }}</span>
                    </div>
                    <div class="detail__stats-item">
                        <div class="detail__stats-item-tag spd1">SPD</div>
                        <span>{{ pokemon.stats?.SpecialDefense || 0 }}</span>
                    </div>
                    <div class="detail__stats-item">
                        <div class="detail__stats-item-tag spd2">SPD</div>
                        <span>{{ pokemon.stats?.Speed || 0 }}</span>
                    </div>
                </div>
            </div>

            <!-- Evolution Chain -->
            <div class="detail__evolution" v-if="pokemon.evolution_chain && pokemon.evolution_chain.length">
                <div class="detail__evolution-title">Evolution</div>
                <div class="detail__evolution-process">
                    <div v-for="(evo, index) in pokemon.evolution_chain" :key="evo.id" class="evolution-stage">
                        <div class="detail__evolution-item">
                            <p class="detail__evo-name">{{ evo.name }}</p>
                            <img :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.id}.png`" :alt="evo.name">
                        </div>
                        <span v-if="index < pokemon.evolution_chain.length - 1" class="arrow"> &gt; </span>
                    </div>
                </div>
            </div>  
        </div>
    </div>
</template>

<style>
*{
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    font-family: "Inter", sans-serif;
}
.container {
    width: 100%;
    padding-top: 50px;   
}

.back {
    color: #000;
    text-decoration: none;
    transform:translateX(-500px);
    cursor: pointer;
    display: inline;
    width: 65px;
    height: 34px;
    border-radius: 30px;
    font-size: 15px;
    line-height: 24px;
    padding: 10px 20px;
    box-shadow: #63636333 0 4px 8px 0;
    display: inline-flex; 
    align-items: center; 
    width: auto; 
}

.detail {
    width: 500px;
    margin: 30px auto;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.detail__img {
    width: 200px;
    height: 200px;
    background-size: cover;
}
.grass {
    background-color: #78cd54;
}

.poison {
    background-color: #a33ea1; 
}
.detail__types{
    display: flex;
    align-items: center;
    justify-content: center;
}
.detail__types-item{
    border-radius: 5px;
    box-shadow: #0000000d 0px 6px 24px 0px;
    color: #2c3e50;
    font-size: 13px;
    font-weight: 600;
    line-height: 20.8px;
    margin: 0 3px 7px;
    padding: 3px 4px;
    text-align: center;
    text-transform: capitalize;
}
.detail__name {
    color: #2c3e50;
    font-size: 22.5px;
    font-weight: 700;
    line-height: 36px;
    text-align: center;
    text-transform: capitalize;
}
.detail__talk {
    font-size: 15px;
    line-height: 24px;
    margin: 0 0 10px;
    text-align: center;
    color: #2c3e50;
}
.detail__body, .detail__abilities-items {
    width: 500px;
    display: flex;
    justify-content: space-around;
}
.detail__body-col{
    display: flex;
    flex-direction: column;
}
.detail__body-label{
    width: 110px;
    color: #2c3e50;
    font-size: 17.55px;
    font-weight: 600;
    line-height: 28.08px;
    margin: 0 0 5px;
    text-align: center;
}
.detail__body-index, .detail__abilities-item{
    width: 100px;
    background-color: #f6f8fc;
    border-radius: 30px;
    color: #2c3e50;
    font-size: 15px;
    line-height: 24px;
    margin: 5px;
    padding: 2px;
    text-align: center;
    text-transform: capitalize;
}

.detail__abilities, .detail__stats {
    margin-bottom: 20px;
}

.detail__abilities-title, .detail__stats-title, .detail__evolution-title{
    color: #2c3e50;
    font-size: 17.55px;
    font-weight: 600;
    line-height: 28.08x;
    text-align: center;
    margin: 0 0 7px;
    text-transform: capitalize;
}

.detail__stats-items{
    width: 500px;
    display: flex;
    justify-content: space-around;
}

.detail__stats-item{
    background-color: #f6f8fc;
    border-radius: 30px;
    box-shadow: #63636333 0 2px 8px 0;
    color: #2c3e50;
    font-size: 15px;
    line-height: 24px;
    margin: 5px;
    padding: 5px;
    text-align: center;
}
.detail__stats-item-tag{
    width: 25px;
    height: 25px;
    align-items: center;
    border-radius: 50%;
    color: #fff;
    display: flex;
    font-size: 10px;
    font-weight: 700;
    justify-content: center;
    line-height: 16px;
    text-align: center;
    text-transform: uppercase;
    margin-bottom: 5px;
}
.hp {
    background-color: #df2140;
}
.atk {
    background-color: #ff994d;
}
.def {
    background-color: #eecd3d;
}
.spa {
    background-color: #85ddff;
}
.spd1 {
    background-color: #95da83;
}
.spd2 {
    background-color: #fb94a8;
}
.detail__evolution{
    width: 100%;
}
.detail__evolution-process{
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
}
.evolution-stage{
    display: flex;
    align-items: center;
    justify-content: space-around;
}
.detail__evolution-item{
    margin-left: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.detail__evo-name{
    color: #2c3e50;
    font-size: 15px;
    font-weight: 600;
    line-height: 24px;
    text-align: center;
    text-transform: capitalize;
}
</style>
