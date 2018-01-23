import Vue from 'vue'
import Router from 'vue-router'
// import store from '@/store'
import { getUserStorage } from '@/common/js/cache'
const Case = () => import('@/components/case/case')
const Doctor = () => import('@/components/doctor/doctor')
const DoctorDetail = () => import('@/components/doctorDetail/doctorDetail')
const Profile = () => import('@/components/profile/profile')
const Project = () => import('@/components/project/project')
const CaseList = () => import('@/components/caseList/caseList')
const CaseArticle = () => import('@/components/caseArticle/caseArticle')
const ProjectDetail = () => import('@/components/projectDetail/projectDetail')
const ProjectConfirmOrder = () => import('@/components/projectConfirmOrder/projectConfirmOrder')
const ProjectPay = () => import('@/components/projectPay/projectPay')
const WechatOauth = () => import('@/components/wechatOauth/wechatOauth')
const Login = () => import('@/components/login/login')
const OrderList = () => import('@/components/orderList/orderList')
const OrderRefund = () => import('@/components/orderRefund/orderRefund')
const OrderPaid = () => import('@/components/orderPaid/orderPaid')
const OrderNonpaid = () => import('@/components/orderNonpaid/orderNonpaid')
const OrderAll = () => import('@/components/orderAll/orderAll')
const Favor = () => import('@/components/favor/favor')

Vue.use(Router)

let routes = [
  {
    path: '/',
    redirect: '/case'
  },
  {
    path: '/orderlist',
    redirect: '/orderlist/all'
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
    component: Doctor,
    children: [
      {
        name: 'doctor-detail',
        path: ':id',
        component: DoctorDetail
      }
    ]
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
    name: 'order-list',
    path: '/orderlist',
    component: OrderList,
    meta: {
      requireAuth: true
    },
    children: [
      {
        name: 'order-all',
        path: 'all',
        component: OrderAll,
        meta: {
          requireAuth: true
        }
      },
      {
        name: 'order-paid',
        path: 'paid',
        component: OrderPaid,
        meta: {
          requireAuth: true
        }
      },
      {
        name: 'order-nonpaid',
        path: 'nonpaid',
        component: OrderNonpaid,
        meta: {
          requireAuth: true
        }
      },
      {
        name: 'order-refund',
        path: 'refund',
        component: OrderRefund,
        meta: {
          requireAuth: true
        }
      }
    ]
  },
  {
    name: 'loading',
    path: '/oauth',
    component: WechatOauth
  },
  {
    name: 'favor',
    path: '/favor',
    component: Favor
  }
]

const router = new Router({ routes })

router.beforeEach((to, from, next) => {
  let user = getUserStorage()
  let name = to.name
  if (to.matched.some(record => record.meta.requireAuth)) {
    if (!user) {
      next({ name: 'login', query: { visit: name } })
    } else {
      next()
    }
  }
  next()
})

export default router
