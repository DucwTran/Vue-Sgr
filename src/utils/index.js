export const fetchAPI = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data.results;
}
export function getIDPokemon(url) {
    const parts = url.split('/'); 
    return parseInt(parts[parts.length - 2], 10);
}