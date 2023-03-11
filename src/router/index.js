// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Change from 'components/Change.vue'


const routes = [
    { path: '/', name: 'change', component: Change },
    { path: '/history', name: 'history', component: () => import('components/History.vue') },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
