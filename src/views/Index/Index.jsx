import React, { Component } from 'react'
import { Layout, Row, Col } from 'antd'
import screenfull from 'screenfull'
import '@/style/view-style/index.scss'

import aside1 from '@/assets/icon/aside1.svg'
import aside2 from '@/assets/icon/aside2.svg'
import aside3 from '@/assets/icon/aside3.svg'
import aside4 from '@/assets/icon/aside4.svg'
import aside5 from '@/assets/icon/aside5.svg'
import aside6 from '@/assets/icon/aside6.svg'

class Index extends Component {
    fullToggle = () => {
        if (screenfull.isEnabled) {
            screenfull.request(document.getElementById('bar'))
        }
    }
    render() {
        return (
            <Layout className='index animated fadeIn'>
                <Row gutter={8} className='index-box'>
                    <Col>
                        <div className='items'>
                            <a href='#/repairOrder'>
                                <img src={aside1} alt='' />
                            </a>
                            <p>维修单</p>
                            <span className='tip'>2</span>
                        </div>
                    </Col>
                    <Col>
                        <div className='items'>
                            <a href='#/personManage'>
                                <img src={aside3} alt='' />
                            </a>
                            <p>人员管理</p>
                        </div>
                    </Col>
                    <Col>
                        <div className='items'>
                            <a href='#/userManage'>
                                <img src={aside2} alt='' />
                            </a>
                            <p>用户管理</p>
                        </div>
                    </Col>
                    <Col>
                        <div className='items'>
                            <a href='#/knowledgeBase'>
                                <img src={aside4} alt='' />
                            </a>
                            <p>知识库</p>
                        </div>
                    </Col>
                    <Col>
                        <div className='items'>
                            <a href='#/about'>
                                <img src={aside5} alt='' />
                            </a>
                            <p>报表</p>
                        </div>
                    </Col>
                    <Col>
                        <div className='items'>
                            <a href='#/solution'>
                                <img src={aside6} alt='' />
                            </a>
                            <p>解决方案管理</p>
                        </div>
                    </Col>
                </Row>
            </Layout>
        )
    }
}

export default Index
