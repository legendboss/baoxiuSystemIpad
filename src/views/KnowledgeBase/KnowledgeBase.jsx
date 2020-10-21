import React, { Component } from 'react'
import { Layout, Input, message, Spin, Empty, Pagination, Divider } from 'antd'
import '@/style/view-style/knowledgeBase.scss'
import axios from '@/api'
import { APIPad } from '@/api/config'
const { Search } = Input

export default class KnowledgeBase extends Component {
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
        this.getKnowledgeList()
    }

    // 获取知识库列表
    getKnowledgeList = value => {
        const { startPage, pageSize } = this.state
        const model = {
            keyWord: value || '',
            startPage,
            pageSize
        }
        this.setState({ listLoading: true })
        axios
            .get(`${APIPad}/searchKnowledge`, { params: model })
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

    handleTableChange = (page, pageSize) => {
        this.setState(
            {
                startPage: page,
                pageSize: pageSize
            },
            () => {
                this.getKnowledgeList()
            }
        )
    }

    render() {
        const { listLoading, listData, total, startPage } = this.state
        return (
            <Layout className='knowledgeBase animated fadeIn'>
                <div className='knowledgeBase-box'>
                    <div>
                        <Search
                            className='search-input'
                            placeholder='请输入'
                            enterButton='搜索'
                            size='default'
                            onSearch={value => {
                                this.getKnowledgeList(value)
                            }}
                        />
                    </div>
                    <Spin spinning={listLoading}>
                        {listData.length > 0 ? (
                            <div className='text-box'>
                                {listData.map((item, index) => {
                                    return (
                                        <div key={index}>
                                            <div style={{ display: 'flex' }}>
                                                <p className='text-p1'>{item.questionStr}</p>
                                                <p className='text-p'>{item.contentInfo}</p>
                                            </div>
                                            <Divider />
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
