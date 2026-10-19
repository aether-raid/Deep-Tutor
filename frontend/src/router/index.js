import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import AboutPage from '../pages/AboutPage.vue';
import ChatbotPage from '../features/chatbot/ChatbotPage.vue';
import FlashcardsPage from '../features/flashcards/FlashcardsPage.vue';
import WeaknessPage from '../features/weakness/WeaknessPage.vue';

// All routes are pre-registered here. Teams do NOT need to edit this file.
const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/about', name: 'about', component: AboutPage },
  { path: '/chatbot', name: 'chatbot', component: ChatbotPage },
  { path: '/flashcards', name: 'flashcards', component: FlashcardsPage },
  { path: '/weakness', name: 'weakness', component: WeaknessPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
