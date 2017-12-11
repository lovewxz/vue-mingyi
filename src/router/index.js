import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import Case from '@/components/case/case'
import Doctor from '@/components/doctor/doctor'
import Profile from '@/components/profile/profile'
import Project from '@/components/project/project'
import CaseList from '@/components/caseList/caseList'
import CaseArticle from '@/components/caseArticle/caseArticle'
import ProjectDetail from '@/components/projectDetail/projectDetail'
import ProjectConfirmOrder from '@/components/projectConfirmOrder/projectConfirmOrder'
import ProjectPay from '@/components/projectPay/projectPay'
import wechatOauth from '@/components/wechatOauth/wechatOauth'

Vue.use(Router)

let routes = [
  {
    path: '/',
    redirect: '/case'
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
      },
      {
        name: 'project-pay',
        path: 'pay',
        component: ProjectPay
      }
    ]
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
  let fullPath = encodeURIComponent(to.fullPath.substr(1))
  if (to.matched.some(record => record.meta.requireAuth)) {
    if (!user) {
      window.location.href = `/wechat-redirect?visit=${fullPath}`
    } else {
      next()
    }
  }
  next()
})

export default router
