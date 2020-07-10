import React, { Component } from 'react'
import { Layout, Row, Col } from 'antd'
import '@/style/view-style/index.scss'

import aside1 from '@/assets/icon/aside1.svg'
import aside4 from '@/assets/icon/aside4.svg'
import aside7 from '@/assets/icon/aside7.svg'

class Index extends Component {
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
                            <a href='#/knowledgeBase'>
                                <img src={aside4} alt='' />
                            </a>
                            <p>知识库</p>
                        </div>
                    </Col>
                    <Col>
                        <div className='items'>
                            <a href='#/newsList'>
                                <img src={aside7} alt='' />
                            </a>
                            <p>消息列表</p>
                        </div>
                    </Col>
                </Row>
            </Layout>
        )
    }
}

export default Index
