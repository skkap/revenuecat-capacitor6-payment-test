import { createApp } from 'vue'
import './style.css'
import App from './App.vue'


console.log('App is running');



document.addEventListener("deviceready", async function () {
    createApp(App)
    .mount('#app')
}, false);
