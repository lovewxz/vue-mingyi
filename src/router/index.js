import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import { getStorage } from '@/common/js/cache'
const Case = () => import('@/components/case/case')
const Doctor = () => import('@/components/doctor/doctor')
const Profile = () => import('@/components/profile/profile')
const Project = () => import('@/components/project/project')
const CaseList = () => import('@/components/caseList/caseList')
const CaseArticle = () => import('@/components/caseArticle/caseArticle')
const ProjectDetail = () => import('@/components/projectDetail/projectDetail')
const ProjectConfirmOrder = () => import('@/components/projectConfirmOrder/projectConfirmOrder')
const ProjectPay = () => import('@/components/projectPay/projectPay')
const wechatOauth = () => import('@/components/wechatOauth/wechatOauth')
const Login = () => import('@/components/login/login')

Vue.use(Router)

let routes = [
  {
    path: '/',
    redirect: '/case'
  },
  {
    name: 'login',
    path: '/login',
    component: Login
  },
  {
    name: 'case',
    path: '/case',
    component: Case,
    children: [
      {
        name: 'case-list',
        path: 'list/:id',
        component: CaseList,
        children: [
          {
            name: 'case-article',
            path: ':artId',
            component: CaseArticle
          }
        ]
      }
    ]
  },
  {
    name: 'project',
    path: '/project',
    component: Project
  },
  {
    name: 'project-detail',
    path: '/project/:id',
    component: ProjectDetail,
    children: [
      {
        name: 'project-confirm-order',
        path: 'confirm',
        component: ProjectConfirmOrder
      }
    ]
  },
  {
    name: 'project-pay',
    path: '/pay',
    component: ProjectPay
  },
  {
    name: 'doctor',
    path: '/doctor',
    component: Doctor
  },
  {
    name: 'profile',
    path: '/profile',
    component: Profile,
    meta: {
      requireAuth: true
    }
  },
  {
    name: 'loading',
    path: '/oauth',
    component: wechatOauth
  }
]

const router = new Router({ routes })

router.beforeEach((to, from, next) => {
  let user = store.state.user
  let storageUser = getStorage('user')
  // let name = to.name
  if (to.matched.some(record => record.meta.requireAuth)) {
    if (!user && !storageUser) {
      // next({ name: 'login', query: { visit: name } })
      next()
    } else {
      next()
    }
  }
  next()
})

export default router
