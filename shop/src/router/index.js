import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/MyHome.vue'),
    },
    {
      path: '/shop',
      name: 'shop',
      component: () => import('../views/ShoppingCart.vue'),
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('../views/MyTest.vue'),
    },
    {
      path: '/productpage',
      name: 'productpage',
      component: () => import('../views/ProductPage.vue'),
    },
    {
      path: '/shoplist',
      name: 'shoplist',
      component: () => import('../views/ShopList.vue'),
    },
    {
      path: '/userupdate',
      name: 'userupdate',
      component: () => import('../views/UserUpdate.vue'),
    },
    {
      path: '/listupdate',
      name: 'listupdate',
      component: () => import('../views/ListUpdate.vue'),
    },
    {
      path: '/myshop',
      name: 'myshop',
      component: () => import('../views/MyShop.vue'),
    },
    {
      path: '/prodlist',
      name: 'prodlist',
      component: () => import('../views/ProdList.vue'),
    },
    {
      path: '/',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    // 如果是瀏覽器的返回/前進，會自動回到原本位置
    if (savedPosition) {
      return savedPosition;
    } else {
      // 每次導航新頁面都回到最上方
      return { top: 0 };
    }
  },
});

export default router;
