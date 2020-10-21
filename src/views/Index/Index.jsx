import React, { Component } from 'react'
import { Layout, Row, Col, message } from 'antd'
import '@/style/view-style/index.scss'
import axios from '@/api'
import { APIPad } from '@/api/config'

import aside1 from '@/assets/icon/aside1.svg'
import aside4 from '@/assets/icon/aside4.svg'
import aside7 from '@/assets/icon/aside7.svg'
import aside8 from '@/assets/icon/aside8.svg'
const wsNewOrder = new WebSocket(`ws://203.156.231.107:8092/newOrder`)
// const wsNewOrder = new WebSocket(`ws://qikeqike.qicp.vip/newOrder`)
// const wsNewOrder = new WebSocket(`ws://172.16.2.218:8092/newOrder`)

class Index extends Component {
    state = {
        newOrderNum: 0
    }

    componentDidMount() {
        this.onFirstNewOrder()
        wsNewOrder.onopen = function(e) {
            console.log('连接上 wsNewOrder 服务端了')
            wsNewOrder.send({})
        }
        wsNewOrder.onmessage = msg => {
            console.log('接收服务端发过来的消息wsNewOrder: ', msg)
            document.getElementById('bgm').play()
            this.setState({
                newOrderNum: msg.data
            })
        }
        wsNewOrder.onclose = function(e) {
            console.log('wsNewOrder 连接关闭了')
            console.log(e)
        }
    }

    // 第一次获取新订单数
    onFirstNewOrder = () => {
        axios
            .get(`${APIPad}/unTakeOrderSize`, {})
            .then(res => {
                const data = res.data.data
                if (res.data.code === 200) {
                    this.setState({
                        newOrderNum: data
                    })
                } else {
                    message.error(res.data.msg)
                }
            })
            .catch(err => {})
    }

    render() {
        const { newOrderNum } = this.state
        return (
            <Layout className='index animated fadeIn'>
                <audio id='bgm'>
                    <source src='http://downsc.chinaz.net/Files/DownLoad/sound1/201706/8855.mp3' type='audio/mpeg' />
                </audio>
                <Row gutter={8} className='index-box'>
                    <Col>
                        <div className='items'>
                            <a href='#/repairOrder'>
                                <img src={aside1} alt='' />
                            </a>
                            <p>维修单</p>
                            <span className='tip'>{newOrderNum}</span>
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
                    <Col>
                        <div className='items'>
                            <a href='#/monthReport'>
                                <img src={aside8} alt='' />
                            </a>
                            <p>月报</p>
                        </div>
                    </Col>
                </Row>
            </Layout>
        )
    }
}

export default Index
