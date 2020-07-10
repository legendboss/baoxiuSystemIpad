import aside1 from '@/assets/icon/icon_1.svg'
import aside4 from '@/assets/icon/icon_2.svg'
import aside7 from '@/assets/icon/icon_7.svg'

const menu = [
    {
        title: '维修单',
        key: '/repairOrder',
        icon: aside1,
        auth: [1]
    },
    {
        title: '知识库',
        key: '/knowledgeBase',
        icon: aside4,
        auth: [1]
    },
    {
        title: '消息列表',
        key: '/newsList',
        icon: aside7,
        auth: [1]
    }
]

export default menu
