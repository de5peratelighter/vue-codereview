import Vue from 'vue'
import Router from 'vue-router'
import CodeReview from '@/components/CodeReview'
import ReviewersList from '@/components/Reviewers'
import MainConfig from '@/components/MainConfig'
import CapacityDoc from '@/components/CapacityDoc'
import StatsTable from '@/components/StatsTable'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
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
    }
  ]
})
