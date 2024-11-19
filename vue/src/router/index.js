import { createRouter, createWebHistory } from 'vue-router'
import { useCounterStore } from '@/stores/counter'  // 로그인 상태 확인용 store
import ArticleView from '@/views/ArticleView.vue'
import DetailView from '@/views/DetailView.vue'
import SignUpView from '@/views/SignUpView.vue'
import LogInView from '@/views/LogInView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'ArticleView',
      component: ArticleView
    },
    {
      path: '/detail/:id',
      name: 'DetailView',
      component: DetailView
    },
    // {
    //   path: '/signup',
    //   name: 'SignUpView',
    //   component: SignUpView
    // },
    // {
    //   path: '/login',
    //   name: 'LogInView',
    //   component: LogInView
    // }
  ]
})

// 라우터에 beforeEach 훅 추가
router.beforeEach((to, from) => {
  const store = useCounterStore()
  
  // 로그인하지 않은 상태에서 메인 페이지에 접근하려는 경우
  if (to.name === 'ArticleView' && !store.isLogin) {
    window.alert('로그인이 필요합니다.')
    return { name: 'LogInView' } // 로그인 페이지로 리다이렉트
  }

  // 로그인한 상태에서 회원가입 또는 로그인 페이지에 접근하려는 경우
  if ((to.name === 'SignUpView' || to.name === 'LogInView') && store.isLogin) {
    window.alert('이미 로그인이 되어있습니다.')
    return { name: 'ArticleView' } // 메인 페이지로 리다이렉트
  }
})

export default router
