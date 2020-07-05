import React, { Component } from 'react'
import { Layout, Button, Modal, Table, Form, Input, Row, Col, Popconfirm, Select, Tooltip, message } from 'antd'
import '@/style/view-style/knowledgeBase.scss'
import axios from '@/api'
import { API } from '@/api/config'
const { Option } = Select

export default class KnowledgeBase extends Component {
    constructor(props) {
        super(props)
        this.state = {
            type: '', // 类型
            keyWord: '', // 关键字
            startPage: 1,
            pageSize: 10,
            listData: [],
            total: 0,
            listLoading: false,
            addUseCasesVisible: false,
            addCasesSureLoading: false
        }
    }

    formRef = React.createRef()

    componentDidMount() {
        this.getKnowledgeList()
    }

    // 类型select
    typeChange = e => {
        this.setState(
            {
                type: e
            },
            () => {
                this.getKnowledgeList()
            }
        )
    }

    // 关键字 change
    keyWordChange = e => {
        console.log(e)
        this.setState(
            {
                keyWord: e
            },
            () => {
                this.getKnowledgeList()
            }
        )
    }

    // 获取知识库列表
    getKnowledgeList = () => {
        const { type, keyWord, startPage, pageSize } = this.state
        const model = {
            type,
            keyWord,
            startPage,
            pageSize
        }
        this.setState({ listLoading: true })
        axios
            .get(`${API}/knowledgeList`, { params: model })
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
            })
            .catch(err => {})

        this.setState({ listLoading: false })
    }

    // 知识库列表分页
    handleTableChange = (page, pageSize) => {
        console.log(page, pageSize)
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

    // 确定删除该用例吗？ 气泡确认
    onDeleteCases = e => {
        console.log(e)
        axios
            .post(`${API}/knowledgeDel`, e)
            .then(res => {
                if (res.data.code === 200) {
                    message.success('删除成功！')
                    this.getKnowledgeList()
                } else {
                    message.error(res.data.msg)
                }
            })
            .catch(err => {})
    }

    // model 确定
    arHandleOk = e => {
        console.log(e)
        const model = {
            content: e.mSolveWay,
            keyWord: e.mKeyword.toString(),
            type: e.mType
        }
        this.setState({ addCasesSureLoading: true })
        axios
            .get(`${API}/knowledgeAdd`, { params: model })
            .then(res => {
                if (res.data.code === 200) {
                    message.success('添加成功！')
                    this.onCloseResetModel()
                    this.getKnowledgeList()
                } else {
                    message.error(res.data.msg)
                }
            })
            .catch(err => {})
        this.setState({ addCasesSureLoading: false })
    }

    // 关闭销毁弹窗
    onCloseResetModel = () => {
        this.setState({
            addUseCasesVisible: false
        })
        this.formRef.current.resetFields()
    }

    render() {
        const { startPage, listData, total, listLoading, addUseCasesVisible, addCasesSureLoading } = this.state

        const columns = [
            {
                title: '类型',
                dataIndex: 'typeStr'
            },
            {
                title: '关键字',
                dataIndex: 'keyWord'
            },
            {
                title: '解决方法',
                dataIndex: 'contentInfo',
                width: '400px',
                render: (text, record) => (
                    <Tooltip title={text}>
                        <div className='solve-way-text'>{text}</div>
                    </Tooltip>
                )
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <Popconfirm
                        title='确定删除该用例吗？'
                        onConfirm={() => {
                            this.onDeleteCases(record.id)
                        }}
                        okText='确定'
                        cancelText='取消'>
                        <Button type='link' style={{ padding: '0' }}>
                            删除
                        </Button>
                    </Popconfirm>
                )
            }
        ]

        return (
            <Layout className='knowledgeBase animated fadeIn'>
                <div className='knowledgeBase-box'>
                    <div>
                        <label htmlFor='类型'>类型: </label>
                        <Select defaultValue='' style={{ width: 200 }} onChange={this.typeChange}>
                            <Option value=''>全部</Option>
                            <Option value='0'>系统</Option>
                            <Option value='1'>硬件</Option>
                            <Option value='2'>软件</Option>
                        </Select>
                        <label htmlFor='关键字' style={{ width: '65px' }}>
                            关键字:{' '}
                        </label>
                        <Select mode='tags' style={{ width: '300px' }} onChange={this.keyWordChange}></Select>
                    </div>
                    <Button
                        className='add-useCases'
                        type='primary'
                        onClick={() => {
                            this.setState({ addUseCasesVisible: true })
                        }}>
                        ＋ 添加知识库
                    </Button>
                    <Table
                        rowKey='id'
                        columns={columns}
                        dataSource={listData}
                        loading={listLoading}
                        pagination={{
                            showQuickJumper: true,
                            current: startPage,
                            total: total,
                            showTotal: total => `共 ${total} 条`,
                            pageSizeOptions: [10, 20],
                            onChange: (page, pageSize) => this.handleTableChange(page, pageSize)
                        }}
                    />
                </div>
                <Modal
                    wrapClassName='add-useCases-modal'
                    title='添加知识库'
                    visible={addUseCasesVisible}
                    onCancel={this.onCloseResetModel}
                    footer={null}>
                    <div>
                        <Form ref={this.formRef} onFinish={this.arHandleOk}>
                            <Row span={24}>
                                <Col span={21}>
                                    <Form.Item
                                        label='类型：'
                                        name='mType'
                                        rules={[{ required: true, message: '请选择类型！!' }]}
                                        placeholder='请选择类型！'>
                                        <Select style={{ width: 200 }}>
                                            <Option value='0'>系统</Option>
                                            <Option value='1'>硬件</Option>
                                            <Option value='2'>软件</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={21}>
                                    <Form.Item
                                        label='关键字：'
                                        name='mKeyword'
                                        rules={[{ required: true, message: '请输入关键字!' }]}>
                                        <Select mode='tags' style={{ width: '300px' }}></Select>
                                    </Form.Item>
                                </Col>
                                <Col span={21}>
                                    <Form.Item
                                        label='解决方法：'
                                        name='mSolveWay'
                                        rules={[{ required: true, message: '请输入解决方法!' }]}>
                                        <Input.TextArea />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item style={{ marginBottom: '0px' }}>
                                <Button
                                    type='primary'
                                    htmlType='submit'
                                    className='add-engineer-sure'
                                    loading={addCasesSureLoading}>
                                    确定
                                </Button>
                                <Button className='add-engineer-sure' onClick={this.onCloseResetModel}>
                                    取消
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Modal>
            </Layout>
        )
    }
}
