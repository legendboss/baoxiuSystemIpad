import React, { Component } from 'react'
import { Layout, Button, Modal, Table, Form, Input, Row, Col, Space, Select, message, Popconfirm } from 'antd'
import axios from '@/api'
import { API } from '@/api/config'
import '@/style/view-style/solution.scss'
const { Option } = Select

export default class Solution extends Component {
    constructor(props) {
        super(props)
        this.state = {
            startPage: 1,
            pageSize: 10,
            listData: [],
            total: 0,
            listLoading: false,
            solutionVisible: false,
            solutionRowData: {},
            solutionSureLoading: false
        }
    }

    formRef = React.createRef()

    componentDidMount() {
        this.getFixList()
    }

    // 获取解决方案列表
    getFixList = () => {
        const { startPage, pageSize } = this.state
        const model = {
            startPage,
            pageSize
        }
        this.setState({ listLoading: true })
        axios
            .get(`${API}/fixList`, { params: model })
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

    // 解决方案列表分页
    handleTableChange = (page, pageSize) => {
        console.log(page, pageSize)
        this.setState(
            {
                startPage: page,
                pageSize: pageSize
            },
            () => {
                this.getFixList()
            }
        )
    }

    // 提交打开model
    onOpenSubmit = e => {
        console.log(e)
        this.setState({
            solutionVisible: true,
            solutionRowData: e
        })
        // 回显数据
        this.formRef.current.setFieldsValue({
            type: e.type,
            fixContent: e.fixContent,
            mKeyword: [e.softName]
        })
    }

    // model 确定
    arHandleOk = e => {
        // 1: 添加知识库 2: 变更解决方案状态
        console.log(e)
        const model = {
            content: e.fixContent,
            keyWord: e.mKeyword.toString(),
            type: e.type
        }
        this.setState({ solutionSureLoading: true })
        axios
            .get(`${API}/knowledgeAdd`, { params: model })
            .then(res => {
                if (res.data.code === 200) {
                    this.onChangeFixStatus()
                } else {
                    message.error(res.data.msg)
                }
            })
            .catch(err => {})
        this.setState({ solutionSureLoading: false })
    }

    // 变更解决方案状态
    onChangeFixStatus = () => {
        const { solutionRowData } = this.state
        const model = {
            id: solutionRowData.id,
            status: 1
        }
        axios
            .post(`${API}/fixOrderChangeStatus`, model)
            .then(res => {
                if (res.data.code === 200) {
                    this.onCloseResetModel()
                } else {
                    message.error(res.data.msg)
                }
            })
            .catch(err => {})
    }

    // 关闭销毁弹窗
    onCloseResetModel = () => {
        this.setState({
            solutionVisible: false
        })
        this.formRef.current.resetFields()
    }

    // 忽略
    onIgnoreSolution = e => {
        const model = {
            id: e,
            status: 2
        }
        axios
            .post(`${API}/fixOrderChangeStatus`, model)
            .then(res => {
                if (res.data.code === 200) {
                    this.getFixList()
                } else {
                    message.error(res.data.msg)
                }
            })
            .catch(err => {})
    }

    render() {
        const { startPage, listData, total, listLoading, solutionVisible, solutionSureLoading } = this.state

        const columns = [
            {
                title: '工程师姓名',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: '类型',
                dataIndex: 'type',
                render: (text, record) => {
                    let typeStr = ''
                    switch (record.type) {
                        case 0:
                            typeStr = '系统'
                            break
                        case 1:
                            typeStr = '硬件'
                            break
                        case 2:
                            typeStr = '软件'
                            break
                        default:
                            break
                    }
                    return <span>{typeStr}</span>
                }
            },
            {
                title: '软件名',
                dataIndex: 'softName'
            },
            {
                title: '解决方案',
                dataIndex: 'fixContent'
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <div>
                        {record.status === 0 && (
                            <Space>
                                <Button
                                    type='link'
                                    style={{ padding: '0' }}
                                    onClick={() => {
                                        this.onOpenSubmit(record)
                                    }}>
                                    提交
                                </Button>
                                <Popconfirm
                                    title='确定忽略该方案吗？'
                                    onConfirm={() => {
                                        this.onIgnoreSolution(record.id)
                                    }}
                                    okText='确定'
                                    cancelText='取消'>
                                    <Button type='link' style={{ padding: '0' }}>
                                        忽略
                                    </Button>
                                </Popconfirm>
                            </Space>
                        )}
                        {record.status === 1 && <span>已提交</span>}
                        {record.status === 2 && <span>已忽略</span>}
                    </div>
                )
            }
        ]

        return (
            <Layout className='solution animated fadeIn'>
                <div className='solution-box'>
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
                    title='解决方案'
                    visible={solutionVisible}
                    onCancel={this.onCloseResetModel}
                    footer={null}
                    forceRender>
                    <div>
                        <Form ref={this.formRef} onFinish={this.arHandleOk}>
                            <Row span={24}>
                                <Col span={21}>
                                    <Form.Item
                                        label='类型：'
                                        name='type'
                                        rules={[{ required: true, message: '请输入类型!' }]}>
                                        <Select style={{ width: 200 }}>
                                            <Option value={0}>系统</Option>
                                            <Option value={1}>硬件</Option>
                                            <Option value={2}>软件</Option>
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
                                        name='fixContent'
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
                                    loading={solutionSureLoading}>
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
