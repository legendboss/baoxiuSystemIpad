import React, { Component } from 'react'
import { Layout, Button, Modal, Table, Form, Input, Row, Col, Space, Divider, message, Empty } from 'antd'
import '@/style/view-style/userManage.scss'
import axios from '@/api'
import { API } from '@/api/config'
const { Search } = Input

export default class UserManage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '', // 用户
            startPage: 1,
            pageSize: 10,
            listData: [],
            total: 0,
            listLoading: false,
            addUserVisible: false,
            addUserSureLoading: false,
            deviceSureLoading: false,
            repairHistoryVisible: false,
            deviceManageVisible: false,
            historyList: [] // 报修历史数据
        }
    }

    formRef = React.createRef()
    formDeviceRef = React.createRef()

    componentDidMount() {
        this.getUserList()
    }

    // 获取用户管理列表
    getUserList = () => {
        const { name, startPage, pageSize } = this.state
        const model = {
            name,
            startPage,
            pageSize
        }
        this.setState({ listLoading: true })
        axios
            .get(`${API}/UserList`, { params: model })
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

    // 用户管理列表分页
    handleTableChange = (page, pageSize) => {
        console.log(page, pageSize)
        this.setState(
            {
                startPage: page,
                pageSize: pageSize
            },
            () => {
                this.getUserList()
            }
        )
    }

    onNameSearch = e => {
        this.setState(
            {
                name: e
            },
            () => {
                this.getUserList()
            }
        )
    }

    // 添加用户 model 确定
    arHandleOk = e => {
        this.setState({ addUserSureLoading: true })
        axios
            .post(`${API}/addUser`, e)
            .then(res => {
                if (res.data.code === 200) {
                    message.success('添加成功！')
                    this.onCloseResetModel()
                    this.getUserList()
                } else {
                    message.error(res.data.msg)
                }
            })
            .catch(err => {})
        this.setState({ addUserSureLoading: false })
    }

    // 关闭销毁添加用户弹窗
    onCloseResetModel = () => {
        this.setState({
            addUserVisible: false
        })
        this.formRef.current.resetFields()
    }

    // 报修历史打开
    onRepairHistory = data => {
        const model = { userId: data.id }
        axios
            .get(`${API}/orderHistory`, { params: model })
            .then(res => {
                if (res.data.code === 200) {
                    this.setState({
                        historyList: res.data.data
                    })
                } else {
                    message.error(res.data.msg)
                }
            })
            .catch(err => {})
        this.setState({
            repairHistoryVisible: true
        })
    }

    // 设备管理打开
    onDeviceManage = data => {
        const model = { userId: data.id }
        axios
            .get(`${API}/deviceInfo`, { params: model })
            .then(res => {
                const Data = res.data.data
                if (res.data.code === 200) {
                    // 回显数据
                    this.formDeviceRef.current.setFieldsValue({
                        cpu: Data.cpu,
                        hardDisk: Data.hardDisk,
                        system: Data.system,
                        videoCard: Data.videoCard,
                        printer: Data.printer,
                        mainBoard: Data.mainBoard
                    })
                } else {
                    message.error(res.data.msg)
                }
            })
            .catch(err => {})
        this.setState({
            deviceManageVisible: true,
            deviceRowData: data
        })
    }

    // 设备管理 model 确定
    onDeviceOk = e => {
        const { deviceRowData } = this.state
        console.log(e)
        const model = {
            ...e,
            uid: deviceRowData.id
        }
        this.setState({ deviceSureLoading: true })
        axios
            .post(`${API}/deviceEdit`, model)
            .then(res => {
                if (res.data.code === 200) {
                    message.success('保存成功！')
                    this.onCloseResetDeviceModel()
                } else {
                    message.error(res.data.msg)
                }
            })
            .catch(err => {})
        this.setState({ deviceSureLoading: false })
    }

    // 关闭销毁设备管理弹窗
    onCloseResetDeviceModel = () => {
        this.setState({
            deviceManageVisible: false
        })
        this.formDeviceRef.current.resetFields()
    }

    render() {
        const {
            startPage,
            listData,
            total,
            listLoading,
            addUserVisible,
            addUserSureLoading,
            repairHistoryVisible,
            deviceManageVisible,
            historyList,
            deviceSureLoading
        } = this.state

        const columns = [
            {
                title: '姓名',
                dataIndex: 'userName'
            },
            {
                title: '添加时间',
                dataIndex: 'addTimeStr'
            },
            {
                title: '手机号',
                dataIndex: 'phone'
            },
            {
                title: '操作',
                render: (text, record) => (
                    <Space>
                        <Button
                            type='link'
                            style={{ padding: '0' }}
                            onClick={() => {
                                this.onRepairHistory(record)
                            }}>
                            报修历史
                        </Button>
                        <Button
                            type='link'
                            style={{ padding: '0' }}
                            onClick={() => {
                                this.onDeviceManage(record)
                            }}>
                            设备管理
                        </Button>
                    </Space>
                )
            }
        ]

        return (
            <Layout className='userManage animated fadeIn'>
                <div className='userManage-box'>
                    <div>
                        <label htmlFor='姓名'>姓名: </label>
                        <Search placeholder='请输入姓名' onSearch={this.onNameSearch} />
                    </div>
                    <Button
                        className='add-user'
                        type='primary'
                        onClick={() => {
                            this.setState({ addUserVisible: true })
                        }}>
                        ＋ 添加用户
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
                    wrapClassName='add-user-modal'
                    title='添加用户'
                    visible={addUserVisible}
                    onCancel={this.onCloseResetModel}
                    footer={null}>
                    <div>
                        <Form ref={this.formRef} onFinish={this.arHandleOk}>
                            <Row span={24}>
                                <Col span={21}>
                                    <Form.Item
                                        label='姓名：'
                                        name='name'
                                        rules={[{ required: true, message: '请输入姓名!' }]}>
                                        <Input placeholder='请输入姓名' autoComplete='off' />
                                    </Form.Item>
                                </Col>
                                <Col span={21}>
                                    <Form.Item
                                        label='手机号：'
                                        name='phone'
                                        rules={[
                                            { required: true, message: '请输入正确手机号!' },
                                            { pattern: /^1[3|4|5|7|8][0-9]\d{8}$/, message: '请输入正确手机号' }
                                        ]}>
                                        <Input placeholder='请输入手机号' autoComplete='off' />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item style={{ marginBottom: '0px' }}>
                                <Button
                                    type='primary'
                                    htmlType='submit'
                                    className='add-user-sure'
                                    loading={addUserSureLoading}>
                                    确定
                                </Button>
                                <Button className='add-user-sure' onClick={this.onCloseResetModel}>
                                    取消
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Modal>

                {/* 报修历史 */}
                <Modal
                    wrapClassName='repair-history-modal'
                    title='报修历史'
                    visible={repairHistoryVisible}
                    onCancel={() => {
                        this.setState({ repairHistoryVisible: false })
                    }}
                    footer={null}>
                    <div className='rh-box'>
                        {historyList.length > 0 ? (
                            historyList.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <p>报修时间：{item.addTimeStr}</p>
                                        <p>报修内容：{item.content}</p>
                                        <p>报修附件：</p>
                                        <div className='img-box'>
                                            {item.applicationPhoto.length > 0 ? (
                                                <div>
                                                    {item.applicationPhoto.map((item2, index2) => {
                                                        return <img key={index2} src={item2} alt='' />
                                                    })}
                                                </div>
                                            ) : (
                                                <span>无</span>
                                            )}
                                        </div>
                                        {historyList.length > 1 && <Divider />}
                                    </div>
                                )
                            })
                        ) : (
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        )}
                    </div>
                </Modal>

                {/* 设备管理 */}
                <Modal
                    wrapClassName='device-manage-modal'
                    title='设备管理'
                    visible={deviceManageVisible}
                    onCancel={this.onCloseResetDeviceModel}
                    footer={null}>
                    <div>
                        <Form ref={this.formDeviceRef} onFinish={this.onDeviceOk}>
                            <Row span={24}>
                                <Col span={12}>
                                    <Form.Item label='CPU：' name='cpu'>
                                        <Input placeholder='请输入' autoComplete='off' />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label='硬盘：' name='system'>
                                        <Input placeholder='请输入' autoComplete='off' />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row span={24}>
                                <Col span={12}>
                                    <Form.Item label='打印机：' name='printer'>
                                        <Input placeholder='请输入' autoComplete='off' />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label='内存：' name='hardDisk'>
                                        <Input placeholder='请输入' autoComplete='off' />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row span={24}>
                                <Col span={12}>
                                    <Form.Item label='显卡：' name='videoCard'>
                                        <Input placeholder='请输入' autoComplete='off' />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label='主板：' name='mainBoard'>
                                        <Input placeholder='请输入' autoComplete='off' />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item style={{ marginBottom: '0px' }}>
                                <Button
                                    type='primary'
                                    htmlType='submit'
                                    className='add-user-sure'
                                    loading={deviceSureLoading}>
                                    确定
                                </Button>
                                <Button className='add-user-sure' onClick={this.onCloseResetDeviceModel}>
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
