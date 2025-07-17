import { createRouter, createWebHistory } from 'vue-router'

// Import pages and components
import BlankLayout from '../layouts/blank.vue'
import DefaultLayout from '../layouts/default.vue'
import ForgotPassword from '../pages/Auth/forgot-password.vue'
import LoginPage from '../pages/Auth/login.vue'
import RegisterPage from '../pages/Auth/register.vue'
import ResetPassword from '../pages/Auth/reset-password.vue'
import NotFoundPage from '../pages/[...all].vue'
import DashboardPage from '../pages/dashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: DashboardPage,
          meta: { requiresAuth: true },
        },

        // Other dashboard child routes
        {
          path: 'reports',
          component: () => import('../pages/reports.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'daily-reports',
          component: () => import('../pages/daily-reports.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'reports-export',
          component: () => import('../pages/reports-export.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'loans',
          component: () => import('../pages/loans.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'send-money',
          component: () => import('../pages/send-money.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'airtime',
          component: () => import('../pages/airtime.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'tokens',
          component: () => import('../pages/tokens.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'farmers',
          component: () => import('../pages/farmers.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'produce',
          component: () => import('../pages/produce-kilos.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'users',
          component: () => import('../pages/system-users.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'system-logs',
          component: () => import('../pages/activities.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'account-settings',
          component: () => import('../pages/account-settings.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'typography',
          component: () => import('../pages/typography.vue'),
        },
        {
          path: 'icons',
          component: () => import('../pages/icons.vue'),
        },

        // Add additional routes as needed...
      ],
    },
    {
      path: '/',
      component: BlankLayout,
      children: [
        {
          path: 'login',
          name: 'login',
          component: LoginPage,
        },
        {
          path: 'register',
          component: RegisterPage,
        },
        {
          path: 'forgot-password',
          component: ForgotPassword,
        },
        {
          path: '/reset-password/:token',
          name: 'reset-password',
          component: ResetPassword,
        },
        {
          path: '/:pathMatch(.*)*',
          component: NotFoundPage,
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {

  const loggedIn = localStorage.getItem("user")  // Assume 'user' contains the logged-in user data

  // Check if the route requires authentication and if the user is not logged in
  if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
    // If not logged in, redirect to login page
    next('/login')
  } else {
    // If no auth required or user is logged in, allow access
    next()
  }
})

export default router
