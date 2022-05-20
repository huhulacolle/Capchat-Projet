import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// eslint-disable-next-line no-unused-vars
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/';

createApp(App).use(router).mount('#app')
