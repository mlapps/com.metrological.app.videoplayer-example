import { Advanced, Simple, Complete, Debug } from './pages'

export default {
  root: 'simple',
  routes: [
    {
      path: 'simple',
      component: Simple,
      widgets: ['Menu'],
    },
    {
      path: 'advanced',
      component: Advanced,
      widgets: ['Menu'],
    },
    {
      path: 'complete',
      component: Complete,
      widgets: ['Menu'],
    },
    {
      path: 'debug',
      component: Debug,
      widgets: ['Menu'],
    },
  ],
}
