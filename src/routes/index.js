import loadable from '@/utils/loadable'

const Index = loadable(() => import(/* webpackChunkName: 'index' */ '@/views/Index'))
const RepairOrder = loadable(() => import(/* webpackChunkName: 'index' */ '@/views/RepairOrder'))
const PersonManage = loadable(() => import(/* webpackChunkName: 'index' */ '@/views/PersonManage'))
const UserManage = loadable(() => import(/* webpackChunkName: 'index' */ '@/views/UserManage'))
const KnowledgeBase = loadable(() => import(/* webpackChunkName: 'index' */ '@/views/KnowledgeBase'))
const Report = loadable(() => import(/* webpackChunkName: 'index' */ '@/views/Report'))
const Solution = loadable(() => import(/* webpackChunkName: 'index' */ '@/views/Solution'))

const routes = [
    { path: '/index', exact: true, name: 'Index', component: Index, auth: [1] },
    { path: '/repairOrder', exact: true, name: 'RepairOrder', component: RepairOrder, auth: [1] },
    { path: '/personManage', exact: true, name: 'PersonManage', component: PersonManage, auth: [1] },
    { path: '/userManage', exact: true, name: 'UserManage', component: UserManage, auth: [1] },
    { path: '/knowledgeBase', exact: true, name: 'KnowledgeBase', component: KnowledgeBase, auth: [1] },
    { path: '/report', exact: true, name: 'Report', component: Report, auth: [1] },
    { path: '/solution', exact: true, name: 'Solution', component: Solution, auth: [1] }
]

export default routes
