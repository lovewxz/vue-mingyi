import Vue from 'vue'
import Router from 'vue-router'
import Case from '@/components/case/case'
import Doctor from '@/components/doctor/doctor'
import Profile from '@/components/profile/profile'
import Project from '@/components/project/project'
import CaseList from '@/components/caseList/caseList'
import CaseArticle from '@/components/caseArticle/caseArticle'
import ProjectDetail from '@/components/projectDetail/projectDetail'

Vue.use(Router)

export default new Router({
  routes: [
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
      component: ProjectDetail
    },
    {
      name: 'doctor',
      path: '/doctor',
      component: Doctor
    },
    {
      name: 'profile',
      path: '/profile',
      component: Profile
    }
  ]
})
