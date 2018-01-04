import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/404', component: _import('404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [
      {
        path: 'dashboard',
        component: _import('dashboard/index')
      }
    ]
  },
  {
    path: '/catelist',
    component: Layout,
    redirect: '/category/index',
    name: 'category',
    children: [
      {
        path: 'index',
        name: 'category-index',
        component: _import('category-list/category-list'),
        meta: { title: '分类目录', icon: 'chart' }
      }
    ]
  },
  {
    path: '/project',
    component: Layout,
    redirect: '/project/index',
    name: 'project',
    meta: { title: '项目产品', icon: 'example' },
    children: [
      {
        path: 'index',
        name: 'project-index',
        component: _import('project/project'),
        meta: { title: '项目列表', icon: 'table' }
      },
      {
        path: 'add',
        name: 'project-add',
        component: _import('project-operation/project-operation'),
        meta: { title: '添加项目', icon: 'form' }
      },
      {
        path: 'edit/:id',
        name: 'project-edit',
        hidden: true,
        component: _import('project-operation/project-operation'),
        meta: { title: '编辑项目' }
      }
    ]
  },
  {
    path: '/pcase',
    component: Layout,
    redirect: '/pcase/index',
    name: 'pcase',
    meta: { title: '真人案例', icon: 'people' },
    children: [
      {
        path: 'index',
        name: 'pcase-index',
        component: _import('people-case/people-case'),
        meta: { title: '案例列表', icon: 'table' }
      },
      {
        path: 'add',
        name: 'pcase-add',
        component: _import('people-case-operation/people-case-operation'),
        meta: { title: '添加项目', icon: 'form' }
      },
      {
        path: 'edit/:id',
        name: 'pcase-edit',
        hidden: true,
        component: _import('people-case-operation/people-case-operation'),
        meta: { title: '编辑项目' }
      }
    ]
  },
  {
    path: '/diary',
    component: Layout,
    redirect: '/diary/index',
    name: 'diary',
    meta: { title: '案例日记', icon: 'documentation' },
    children: [
      {
        path: 'index',
        name: 'diary-index',
        component: _import('diary/diary'),
        meta: { title: '日记列表', icon: 'table' }
      },
      {
        path: 'add',
        name: 'diary-add',
        component: _import('diary-operation/diary-operation'),
        meta: { title: '添加日记', icon: 'form' }
      },
      {
        path: 'edit/:id',
        name: 'diary-edit',
        hidden: true,
        component: _import('diary-operation/diary-operation'),
        meta: { title: '编辑日记' }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  // {
  //   path: '/form',
  //   component: Layout,
  //   meta: { role: ['admin'] },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: _import('form/index'),
  //       meta: { title: 'Form', icon: 'form' }
  //     }
  //   ]
  // },
  { path: '*', redirect: '/404', hidden: true }
]
