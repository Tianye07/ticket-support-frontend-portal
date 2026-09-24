import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  /* Default */
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/ticket-creation',
    name: 'TicketCreation',
    component: () => import('../views/ticket/TicketCreation.vue'),
  },
  {
    path: '/ticket-details/:id',
    name: 'TicketDetails',
    component: () => import('../views/ticket/TicketDetails.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
