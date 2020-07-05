import aside1 from '@/assets/icon/icon_1.svg'
import aside2 from '@/assets/icon/icon_2.svg'
import aside3 from '@/assets/icon/icon_3.svg'
import aside4 from '@/assets/icon/icon_4.svg'
import aside5 from '@/assets/icon/icon_5.svg'
import aside6 from '@/assets/icon/icon_6.svg'

const menu = [
    {   
        title: '维修单',
        key: '/repairOrder',
        icon: aside1,
        auth: [1]
    },
    {
        title: '人员管理',
        key: '/personManage',
        icon: aside3,
        auth: [1]
    },
    {
        title: '用户管理',
        key: '/userManage',
        icon: aside2,
        auth: [1]
    },
    {
        title: '知识库',
        key: '/knowledgeBase',
        icon: aside4,
        auth: [1]
    },
    {
        title: '报表',
        key: '/report',
        icon: aside5,
        auth: [1]
    },
    {
        title: '解决方案管理',
        key: '/solution',
        icon: aside6,
        auth: [1]
    }
]

export default menu
