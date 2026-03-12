import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/pages/RegisterPage.vue'),
    meta: {
      layout: 'auth',
      requiresAuth: false
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/pages/HomePage.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/board',
    name: 'Board',
    component: () => import('@/pages/BoardPage.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/vocabulary',
    name: 'Vocabulary',
    component: () => import('@/pages/VocabularyPage.vue'),
    meta: {
      requiresAuth: true,
      hideNavbar: true
    }
  },
  {
    path: '/vocabulary/settings',
    name: 'CategorySettings',
    component: () => import('@/pages/CategorySettingsPage.vue'),
    meta: {
      requiresAuth: true,
      hideNavbar: true
    }
  },
  {
    path: '/vocabulary/set/:setId',
    name: 'WordSet',
    component: () => import('@/pages/WordSetPage.vue'),
    meta: {
      requiresAuth: true,
      hideNavbar: true
    }
  },
  {
    path: '/vocabulary/set/:setId/learn',
    name: 'Learn',
    component: () => import('@/pages/LearnPage.vue'),
    meta: {
      requiresAuth: true,
      hideNavbar: true
    }
  },
  {
    path: '/vocabulary/set/:setId/test',
    name: 'Test',
    component: () => import('@/pages/TestPage.vue'),
    meta: {
      requiresAuth: true,
      hideNavbar: true
    }
  },
  {
    path: '/vocabulary/set/:setId/writing',
    name: 'Writing',
    component: () => import('@/pages/WritingPage.vue'),
    meta: {
      requiresAuth: true,
      hideNavbar: true
    }
  },
  {
    path: '/vocabulary/set/:setId/pronunciation',
    name: 'Pronunciation',
    component: () => import('@/pages/PronunciationPage.vue'),
    meta: {
      requiresAuth: true,
      hideNavbar: true
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/pages/ProfilePage.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/coming-soon',
    name: 'ComingSoon',
    component: () => import('@/pages/ComingSoonPage.vue'),
    meta: {
      requiresAuth: true,
      hideNavbar: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/home'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  }
})

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthChecked) {
    // Telegram dan telegramId olish
    const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString()

    if (telegramId) {
      // API dan auth/check — registered bo'lsa token oladi
      await authStore.checkAuth(telegramId)
    } else {
      // Telegram yo'q (browser test) — localStorage dan tekshirish
      authStore.initAuth()
      authStore.isAuthChecked = true
    }
  }

  const requiresAuth = to.meta.requiresAuth !== false

  if (requiresAuth && !authStore.isRegistered) {
    next('/register')
  } else if (to.path === '/register' && authStore.isRegistered) {
    next('/home')
  } else {
    next()
  }
})

export default router
