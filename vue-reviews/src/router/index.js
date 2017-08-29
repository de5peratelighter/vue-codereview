import Vue from 'vue'
import Router from 'vue-router'
import CodeReview from '@/components/CodeReview'
import ReviewersList from '@/components/Reviewers'
import MainConfig from '@/components/MainConfig'
import CapacityDoc from '@/components/capacity/CapacityDoc'
import StatsTable from '@/components/StatsTable'
import SuperDoc from '@/components/SuperDoc'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', 
      redirect: { name: 'CodeReview' }
    },
    {
      path: '/main',
      name: 'CodeReview',
      component: CodeReview,
    },
    {
      path: '/reviewers',
      name: 'ReviewersList',
      component: ReviewersList
      
    },
    {
      path: '/capacity',
      name: 'CapacityDoc',
      component: CapacityDoc
      
    },
    {
      path: '/config',
      name: 'MainConfig',
      component: MainConfig
    },
    {
      path: '/stats',
      name: 'StatsTable',
      component: StatsTable
    },
    {
      path: '/super',
      name: 'SuperDoc',
      component: SuperDoc
    }
  ]
})
