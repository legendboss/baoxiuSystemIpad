import loadable from '@/utils/loadable'

const Index = loadable(() => import(/* webpackChunkName: 'index' */ '@/views/Index'))
const RepairOrder = loadable(() => import(/* webpackChunkName: 'index' */ '@/views/RepairOrder'))
const KnowledgeBase = loadable(() => import(/* webpackChunkName: 'index' */ '@/views/KnowledgeBase'))
const NewsList = loadable(() => import(/* webpackChunkName: 'index' */ '@/views/NewsList'))

const routes = [
    { path: '/index', exact: true, name: 'Index', component: Index, auth: [1] },
    { path: '/repairOrder', exact: true, name: 'RepairOrder', component: RepairOrder, auth: [1] },
    { path: '/knowledgeBase', exact: true, name: 'KnowledgeBase', component: KnowledgeBase, auth: [1] },
    { path: '/newsList', exact: true, name: 'NewsList', component: NewsList, auth: [1] }
]

export default routes
