import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import BilhetePage from '../pages/BilhetePage.vue';

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/bilhete/:codigo', name: 'Bilhete', component: BilhetePage }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
