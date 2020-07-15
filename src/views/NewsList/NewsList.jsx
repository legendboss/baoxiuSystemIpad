import React, { Component } from 'react'
import { Layout, message, Spin, Pagination, Divider, Empty, Badge } from 'antd'
import '@/style/view-style/newsList.scss'
import axios from '@/api'
import { APIPad } from '@/api/config'

class NewsList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listLoading: false,
            startPage: 1,
            pageSize: 10,
            listData: [],
            total: 0
        }
    }
    componentDidMount() {
        // 获取列表
        this.getNewsList()
    }

    // 获取消息列表
    getNewsList = () => {
        const { startPage, pageSize } = this.state
        const model = {
            startPage,
            pageSize
        }
        this.setState({ listLoading: true })
        axios
            .get(`${APIPad}/messageList`, { params: model })
            .then(res => {
                const data = res.data.data
                if (res.data.code === 200) {
                    this.setState({
                        listData: data.list,
                        total: data.total
                    })
                } else {
                    message.error(res.data.msg)
                }
                this.setState({ listLoading: false })
            })
            .catch(err => {
                this.setState({ listLoading: false })
            })
    }

    // 消息列表分页
    handleTableChange = (page, pageSize) => {
        this.setState(
            {
                startPage: page,
                pageSize: pageSize
            },
            () => {
                this.getNewsList()
            }
        )
    }

    // 读取消息
    onReadMessage = id => {
        axios
            .get(`${APIPad}/readMessage?id=${id}`)
            .then(res => {
                if (res.data.code === 200) {
                    this.getNewsList()
                } else {
                    message.error(res.data.msg)
                }
            })
            .catch(err => {})
    }

    render() {
        const { listLoading, listData, total, startPage } = this.state
        return (
            <Layout className='newsList animated fadeIn'>
                <div className='newsList-box'>
                    <Spin spinning={listLoading}>
                        {listData.length > 0 ? (
                            <div className='text-box'>
                                {listData.map((item, index) => {
                                    return (
                                        <div key={index}>
                                            {item.isRead === 1 ? ( // 未读
                                                <div
                                                    onClick={() => {
                                                        this.onReadMessage(item.id)
                                                    }}>
                                                    <Badge status='error' text={item.addTimeStr} />
                                                    <p className='text-p'>{item.content}</p>
                                                    <Divider />
                                                </div>
                                            ) : (
                                                <div>
                                                    <Badge status='default' text={item.addTimeStr} />
                                                    <p className='text-p'>{item.content}</p>
                                                    <Divider />
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                                <Pagination
                                    size='small'
                                    style={{ textAlign: 'end' }}
                                    showQuickJumper
                                    current={startPage}
                                    total={total}
                                    showTotal={total => `共 ${total} 条`}
                                    onChange={(page, pageSize) => this.handleTableChange(page, pageSize)}
                                />
                            </div>
                        ) : (
                            <div style={{ margin: '60px auto' }}>
                                <Empty />
                            </div>
                        )}
                    </Spin>
                </div>
            </Layout>
        )
    }
}

export default NewsList
