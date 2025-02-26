import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // Import Router

const app = createApp(App);
app.use(router); // Dùng Vue Router
app.mount("#app");
