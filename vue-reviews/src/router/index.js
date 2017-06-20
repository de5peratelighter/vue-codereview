import Vue from 'vue'
import Router from 'vue-router'
import CodeReview from '@/components/CodeReview'
import ReviewersList from '@/components/Reviewers'

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
      
    }
  ]
})
