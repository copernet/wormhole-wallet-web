const IndexPage = () => import('./Index.vue')
const DisclaimerPage = () => import('./partials/Disclaimer.vue')
const TermsPage = () => import('./partials/TermsOfService.vue')
const FaqPage = () => import('./../indexPage/Faq.vue')

const routes = {
  path: '/legal',
  name: 'IndexPage',
  component: IndexPage,
  children: []
}

routes.children = [
  {
    path: '/disclaimer',
    name: 'disclaimer',
    component: DisclaimerPage
  },
  {
    path: '/termofservice',
    name: 'termofservice',
    component: TermsPage
  },
  {
    path: '/faq',
    name: 'faq',
    component: FaqPage
  }
]
export default routes
