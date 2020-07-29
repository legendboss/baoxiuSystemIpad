import React, { Component } from 'react'
import {
    Layout,
    Select,
    Button,
    Modal,
    Form,
    Row,
    Col,
    Upload,
    Spin,
    message,
    Divider,
    Radio,
    Pagination,
    Empty,
    Input,
    Space
} from 'antd'
import '@/style/view-style/repairOrder.scss'
import { PlusOutlined } from '@ant-design/icons'
// import debounce from 'lodash/debounce'
import axios from '@/api'
import { APIPad, API } from '@/api/config'

const { Option } = Select

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
    })
}

export default class RepairOrder extends Component {
    constructor(props) {
        super(props)
        this.state = {
            orderStatus: '0',
            type: '',
            dateTime: ['', ''],
            startPage: 1,
            pageSize: 10,
            listData: [],
            total: 0,
            listLoading: false,
            engineerList: [],
            fileList: [],
            showEngineer: false,
            repairSureLoading: false,
            newRepairDetailVisible: false, // 详情model-新工单
            orderDetailInfo: {},
            contractVo: { photo: [] },
            fixVo: { photos: [] },
            userDevice: {},
            confirmLoading: false,
            repairHistoryVisible: false,
            historyList: [], // 报修历史数据
            ingRepairDetailVisible: false,
            endRepairDetailVisible: false,
            previewVisible: false,
            previewImage: '',
            planSearchVisible: false,
            planList: [] // 方案查询数据
        }
    }

    formRef = React.createRef()

    componentDidMount() {
        // 获取列表
        this.getRepairOrderList()
        this.fetchEngineer()
    }

    // 订单状态
    onTabChange = e => {
        this.setState(
            {
                orderStatus: e.target.value
            },
            () => {
                this.getRepairOrderList()
            }
        )
    }

    // 获取维修单列表
    getRepairOrderList = () => {
        const { orderStatus, startPage, pageSize } = this.state
        const uid = localStorage.getItem('uid')
        const model = {
            fixId: orderStatus !== '0' ? uid : '',
            orderStatus,
            startPage,
            pageSize
        }
        console.log(model)
        this.setState({ listLoading: true })
        axios
            .get(`${APIPad}/orderList`, { params: model })
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

    // 维修单列表分页
    handleTableChange = (page, pageSize) => {
        console.log(page, pageSize)
        this.setState(
            {
                startPage: page,
                pageSize: pageSize
            },
            () => {
                this.getRepairOrderList()
            }
        )
    }

    // 详情
    onOrderDetail = item => {
        const { orderStatus } = this.state
        if (orderStatus === '0') {
            this.setState({ newRepairDetailVisible: true })
        } else if (orderStatus === '1') {
            this.setState({ ingRepairDetailVisible: true })
        } else if (orderStatus === '2') {
            this.setState({ endRepairDetailVisible: true })
        }
        this.setState({ contractId: item.contractId })
        const model = { id: item.id }
        axios
            .get(`${APIPad}/orderInfo`, { params: model })
            .then(res => {
                if (res.data.code === 200) {
                    this.setState({
                        orderDetailInfo: res.data.data,
                        contractVo: res.data.data.contractVo,
                        fixVo: res.data.data.fixVo,
                        userDevice: res.data.data.contractVo.userDevice
                    })
                    if (orderStatus === '1') {
                        // 回显数据
                        this.formRef.current.setFieldsValue({
                            ...res.data.data.contractVo.userDevice
                        })
                    }
                } else {
                    message.error(res.data.msg)
                }
            })
            .catch(err => {})
    }

    // 接单
    handleNewOrderOk = () => {
        const { orderDetailInfo } = this.state
        this.setState({ confirmLoading: true })
        const model = { id: orderDetailInfo.id }
        axios
            .get(`${APIPad}/receiving`, { params: model })
            .then(res => {
                if (res.data.code === 200) {
                    this.setState({
                        newRepairDetailVisible: false
                    })
                    this.getRepairOrderList()
                } else {
                    message.error(res.data.msg)
                }
                this.setState({ confirmLoading: false })
            })
            .catch(err => {
                this.setState({ confirmLoading: false })
            })
    }

    // 报修历史打开
    onRepairHistory = () => {
        const { contractId } = this.state
        console.log(contractId)
        const model = { userId: contractId }
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

    // ------------ 进行中维修单-------------
    // 上传
    handleUpChange = ({ fileList }) => this.setState({ fileList })

    // 工程师select
    fetchEngineer = () => {
        const model = {
            role: 1
        }
        axios
            .get(`${API}/UserListMenu`, { params: model })
            .then(res => {
                const Data = res.data.data
                if (res.data.code === 200) {
                    this.setState({ engineerList: Data })
                } else {
                    message.error(res.data.msg)
                }
            })
            .catch(err => {})
    }

    // model 完成
    arHandleOk = e => {
        const { fileList, orderDetailInfo, userDevice } = this.state
        console.log(e)
        console.log(fileList)
        // if (fileList.length <= 0) {
        //     message.error('请上传图片附件！')
        //     return false
        // }
        console.log(e.engineerName)
        if (e.engineerName === undefined && e.fixContent === undefined) {
            message.error('请填写维修方案！')
            return false
        }
        const photo = []
        for (let i = 0; i < fileList.length; i++) {
            if (fileList[i].status !== 'done') {
                message.error('请先等待图片上传完成！')
                return false
            } else {
                photo.push(fileList[i].response.data)
            }
        }
        this.setState({ repairSureLoading: true })
        for (const key in userDevice) {
            userDevice[key] = e[key]
        }
        const model = {
            applicationPhoto: photo,
            reFixId: e.engineerName ? e.engineerName.key[0] : '', // 工程师
            reFixName: e.engineerName ? e.engineerName.key[1] : '',
            orderId: orderDetailInfo.id,
            userDevice,
            fixContent: e.fixContent
        }
        axios
            .post(`${APIPad}/finishOrder`, model)
            .then(res => {
                if (res.data.code === 200) {
                    this.onCloseResetModel()
                    this.getRepairOrderList()
                } else {
                    message.error(res.data.msg)
                }
                this.setState({ repairSureLoading: false })
            })
            .catch(err => {
                this.setState({ repairSureLoading: false })
            })
    }

    // 关闭添加维修单 销毁弹窗
    onCloseResetModel = () => {
        this.setState({
            ingRepairDetailVisible: false,
            fileList: []
        })
        this.formRef.current.resetFields()
    }

    // 图片预览
    handlePreview = async file => {
        console.log(file)
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj)
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true
        })
    }

    // 普通图片预览
    onPreviewImage = url => {
        this.setState({
            previewImage: url,
            previewVisible: true
        })
    }

    // 方案查询打开
    onPlanSearch = () => {
        const { contractVo } = this.state
        let keyWord = ''
        if (contractVo.softName !== '') {
            keyWord = contractVo.softName
        } else {
            switch (contractVo.fixType) {
                case 0:
                    keyWord = '系统'
                    break
                case 1:
                    keyWord = '硬件'
                    break
                case 3:
                    keyWord = '其他'
                    break
                default:
                    break
            }
        }
        const model = { keyWord: keyWord }
        axios
            .get(`${APIPad}/searchFix`, { params: model })
            .then(res => {
                if (res.data.code === 200) {
                    this.setState({
                        planList: res.data.data
                    })
                } else {
                    message.error(res.data.msg)
                }
            })
            .catch(err => {})
        this.setState({
            planSearchVisible: true
        })
    }

    // 列表接单
    onJieOrder = id => {
        axios
            .get(`${APIPad}/receiving?id=${id}`)
            .then(res => {
                if (res.data.code === 200) {
                    this.getRepairOrderList()
                } else {
                    message.error(res.data.msg)
                }
            })
            .catch(err => {})
    }

    render() {
        const {
            startPage,
            listData,
            total,
            listLoading,
            engineerList,
            fileList,
            repairSureLoading,
            newRepairDetailVisible,
            orderDetailInfo,
            contractVo,
            fixVo,
            userDevice,
            confirmLoading,
            repairHistoryVisible,
            historyList,
            ingRepairDetailVisible,
            endRepairDetailVisible,
            previewVisible,
            previewImage,
            planSearchVisible,
            planList
        } = this.state

        const uploadButton = (
            <div>
                <PlusOutlined />
                <div className='ant-upload-text'>上传</div>
            </div>
        )
        return (
            <Layout className='repairOrder animated fadeIn'>
                <div className='repairOrder-box'>
                    <div>
                        <Radio.Group defaultValue='0' style={{ margin: '3px 0 30px 0' }} onChange={this.onTabChange}>
                            <Radio.Button value='0'>新工单</Radio.Button>
                            <Radio.Button value='1'>进行中</Radio.Button>
                            <Radio.Button value='2'>已完成</Radio.Button>
                        </Radio.Group>
                    </div>
                    <Spin spinning={listLoading}>
                        {listData.length > 0 ? (
                            <div className='text-box'>
                                {listData.map((item, index) => {
                                    return (
                                        <div key={index}>
                                            <p className='list-left'>
                                                <span className='p-span'>{item.address}</span>
                                                <span className='p-span'>{item.contractPhone}</span>
                                                <span className='p-span'>{item.contractName}</span>
                                            </p>
                                            <p className='text-p'>{item.content}</p>
                                            <Space style={{ float: 'right' }}>
                                                <Button
                                                    size='small'
                                                    className='detail-btn'
                                                    onClick={() => {
                                                        this.onJieOrder(item.id)
                                                    }}>
                                                    接单
                                                </Button>
                                                <Button
                                                    size='small'
                                                    className='detail-btn'
                                                    onClick={() => {
                                                        this.onOrderDetail(item)
                                                    }}>
                                                    详情
                                                </Button>
                                            </Space>
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
                            <div style={{ margin: '5rem auto' }}>
                                <Empty />
                            </div>
                        )}
                    </Spin>
                </div>
                {/* 详情----------------------------- */}
                {/* 新工单详情 */}
                <Modal
                    wrapClassName='repair-detail-modal'
                    title='详情'
                    visible={newRepairDetailVisible}
                    onCancel={() => {
                        this.setState({ newRepairDetailVisible: false })
                    }}
                    cancelText='关闭'
                    okText='接单'
                    zIndex={1}
                    centered
                    onOk={this.handleNewOrderOk}
                    confirmLoading={confirmLoading}>
                    <div className='rd-box'>
                        <Row span={24}>
                            <Col span={12}>
                                <span>报修人：</span>
                                <span>
                                    {contractVo.contractName}
                                    <Button size='small' className='history-btn' onClick={this.onRepairHistory}>
                                        报修历史
                                    </Button>
                                </span>
                            </Col>
                            <Col span={12}>
                                <span>联系电话：</span>
                                <span>{contractVo.contractPhone}</span>
                            </Col>
                        </Row>
                        <Row span={24}>
                            <Col span={12}>
                                <span>报修内容：</span>
                                <span>{contractVo.content}</span>
                            </Col>
                            <Col span={12}>
                                <span>维修地址：</span>
                                <span>{contractVo.address}</span>
                            </Col>
                        </Row>
                        <Row span={24}>
                            <Col span={12}>
                                <span>系统类型：</span>
                                <span>
                                    {contractVo.fixType === 0
                                        ? '系统'
                                        : contractVo.fixType === 1
                                        ? '硬件'
                                        : contractVo.fixType === 2
                                        ? '软件'
                                        : contractVo.fixType === 3
                                        ? '其他'
                                        : ''}
                                </span>
                            </Col>
                            <Col span={12}>
                                <span>类型：</span>
                                <span>{contractVo.typeStr}</span>
                            </Col>
                        </Row>
                        {contractVo.fixType === 2 && (
                            <Row span={24}>
                                <Col span={12}>
                                    <span>软件名称：</span>
                                    <span>{contractVo.softName}</span>
                                </Col>
                            </Row>
                        )}
                        <Row span={24}>
                            <span>附件：</span>
                            <div className='img-box'>
                                {contractVo.photo.length > 0 ? (
                                    <div>
                                        {contractVo.photo.map((item, index) => {
                                            return (
                                                <img
                                                    key={index}
                                                    src={item}
                                                    alt=''
                                                    onClick={() => {
                                                        this.onPreviewImage(item)
                                                    }}
                                                />
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <span>无</span>
                                )}
                            </div>
                        </Row>
                    </div>
                </Modal>

                {/* 报修历史 */}
                <Modal
                    wrapClassName='repair-history-modal'
                    title='报修历史'
                    visible={repairHistoryVisible}
                    zIndex={2}
                    centered
                    onCancel={() => {
                        this.setState({ repairHistoryVisible: false })
                    }}
                    footer={null}>
                    <div className='rh-box scroll'>
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
                                                        return (
                                                            <img
                                                                key={index2}
                                                                src={item2}
                                                                alt=''
                                                                onClick={() => {
                                                                    this.onPreviewImage(item2)
                                                                }}
                                                            />
                                                        )
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

                {/* 进行中详情 */}
                <Modal
                    wrapClassName='repair-detail-modal'
                    title='详情'
                    visible={ingRepairDetailVisible}
                    onCancel={this.onCloseResetModel}
                    centered
                    zIndex={1}
                    footer={null}>
                    <div>
                        <Form ref={this.formRef} onFinish={this.arHandleOk}>
                            <div className='rd-box scroll'>
                                <Row span={24}>
                                    <Col span={12}>
                                        <span>报修人：</span>
                                        <span>
                                            {contractVo.contractName}
                                            <Button size='small' className='history-btn' onClick={this.onRepairHistory}>
                                                报修历史
                                            </Button>
                                        </span>
                                    </Col>
                                    <Col span={12}>
                                        <span>联系电话：</span>
                                        <span>{contractVo.contractPhone}</span>
                                    </Col>
                                </Row>
                                <Row span={24}>
                                    <Col span={12}>
                                        <span>报修内容：</span>
                                        <span>{contractVo.content}</span>
                                    </Col>
                                    <Col span={12}>
                                        <span>维修地址：</span>
                                        <span>{contractVo.address}</span>
                                    </Col>
                                </Row>
                                <Row span={24}>
                                    <Col span={12}>
                                        <span>系统类型：</span>
                                        <span>
                                            {contractVo.fixType === 0
                                                ? '系统'
                                                : contractVo.fixType === 1
                                                ? '硬件'
                                                : contractVo.fixType === 2
                                                ? '软件'
                                                : contractVo.fixType === 3
                                                ? '其他'
                                                : ''}
                                        </span>
                                    </Col>
                                    <Col span={12}>
                                        <span>类型：</span>
                                        <span>{contractVo.typeStr}</span>
                                    </Col>
                                </Row>
                                <Row span={24}>
                                    {contractVo.fixType === 2 && (
                                        <Col span={12}>
                                            <span>软件名称：</span>
                                            <span>{contractVo.softName}</span>
                                        </Col>
                                    )}
                                    <Col span={12}>
                                        <Button size='small' className='history-btn' onClick={this.onPlanSearch}>
                                            方案查询
                                        </Button>
                                    </Col>
                                </Row>

                                <Row span={24}>
                                    <span>附件：</span>
                                    <div className='img-box'>
                                        {contractVo.photo.length > 0 ? (
                                            <div>
                                                {contractVo.photo.map((item, index) => {
                                                    return (
                                                        <img
                                                            key={index}
                                                            src={item}
                                                            alt=''
                                                            onClick={() => {
                                                                this.onPreviewImage(item)
                                                            }}
                                                        />
                                                    )
                                                })}
                                            </div>
                                        ) : (
                                            <span>无</span>
                                        )}
                                    </div>
                                </Row>
                                {fixVo !== null && (
                                    <div>
                                        <Divider />
                                        <Row span={24}>
                                            <Col span={12}>
                                                <span>工程师：</span>
                                                <span>{fixVo.fixName}</span>
                                            </Col>
                                            <Col span={12}>
                                                <span>订单状态：</span>
                                                <span>
                                                    {orderDetailInfo.orderStatus === 1
                                                        ? '已接单'
                                                        : orderDetailInfo.orderStatus === 0
                                                        ? '未接单'
                                                        : orderDetailInfo.orderStatus === 2
                                                        ? '已完成'
                                                        : orderDetailInfo.orderStatus === 3
                                                        ? '已取消'
                                                        : ''}
                                                </span>
                                            </Col>
                                        </Row>
                                        <Row span={24}>
                                            <span>附件：</span>
                                            <div>
                                                <Upload
                                                    accept='image/*'
                                                    action={`${API}/upLoadPhoto`}
                                                    method='post'
                                                    listType='picture-card'
                                                    fileList={fileList}
                                                    onPreview={this.handlePreview}
                                                    onChange={this.handleUpChange}>
                                                    {fileList.length >= 4 ? null : uploadButton}
                                                </Upload>
                                            </div>
                                        </Row>
                                    </div>
                                )}
                                <Row>
                                    <Divider />
                                    <Col span={18} style={{ marginBottom: '0' }}>
                                        <Form.Item label='维修方案：' name='fixContent'>
                                            <Input.TextArea />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Divider />
                                    <Col span={18}>
                                        <Form.Item label='转交工程师：' name='engineerName'>
                                            <Select placeholder='请选择工程师' labelInValue>
                                                {engineerList.map(item => {
                                                    return (
                                                        <Option key={item.id} value={[item.id, item.name]}>
                                                            {item.name}
                                                        </Option>
                                                    )
                                                })}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                {userDevice !== null && (
                                    <div>
                                        <Divider />
                                        <p>设备详情:</p>
                                        <Row span={22}>
                                            <Col span={11}>
                                                <Form.Item label='CPU：' name='cpu'>
                                                    <Input placeholder='请输入' autoComplete='off' />
                                                </Form.Item>
                                            </Col>
                                            <Col span={11}>
                                                <Form.Item label='硬盘：' name='system'>
                                                    <Input placeholder='请输入' autoComplete='off' />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row span={22}>
                                            <Col span={11}>
                                                <Form.Item label='打印机：' name='printer'>
                                                    <Input placeholder='请输入' autoComplete='off' />
                                                </Form.Item>
                                            </Col>
                                            <Col span={11}>
                                                <Form.Item label='内存：' name='hardDisk'>
                                                    <Input placeholder='请输入' autoComplete='off' />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row span={22}>
                                            <Col span={11}>
                                                <Form.Item label='显卡：' name='videoCard'>
                                                    <Input placeholder='请输入' autoComplete='off' />
                                                </Form.Item>
                                            </Col>
                                            <Col span={11}>
                                                <Form.Item label='主板：' name='mainBoard'>
                                                    <Input placeholder='请输入' autoComplete='off' />
                                                </Form.Item>
                                            </Col>
                                            <Col span={11} style={{ display: 'none' }}>
                                                <Form.Item label='主板：' name='uid'>
                                                    <Input placeholder='请输入' autoComplete='off' />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </div>
                                )}
                            </div>
                            <Form.Item style={{ marginBottom: '0px' }}>
                                <Button
                                    type='primary'
                                    htmlType='submit'
                                    className='add-repair-sure'
                                    disabled={repairSureLoading}
                                    loading={repairSureLoading}>
                                    完成
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Modal>
                {/* 已完成详情 */}
                <Modal
                    wrapClassName='repair-detail-modal'
                    title='详情'
                    visible={endRepairDetailVisible}
                    zIndex={1}
                    onCancel={() => {
                        this.setState({ endRepairDetailVisible: false })
                    }}
                    centered
                    footer={null}>
                    <div className='rd-box scroll'>
                        <Row span={24}>
                            <Col span={12}>
                                <span>报修人：</span>
                                <span>{contractVo.contractName}</span>
                            </Col>
                            <Col span={12}>
                                <span>联系电话：</span>
                                <span>{contractVo.contractPhone}</span>
                            </Col>
                        </Row>
                        <Row span={24}>
                            <Col span={12}>
                                <span>报修内容：</span>
                                <span>{contractVo.content}</span>
                            </Col>
                            <Col span={12}>
                                <span>维修地址：</span>
                                <span>{contractVo.address}</span>
                            </Col>
                        </Row>
                        <Row span={24}>
                            <Col span={12}>
                                <span>系统类型：</span>
                                <span>
                                    {contractVo.fixType === 0
                                        ? '系统'
                                        : contractVo.fixType === 1
                                        ? '硬件'
                                        : contractVo.fixType === 2
                                        ? '软件'
                                        : contractVo.fixType === 3
                                        ? '其他'
                                        : ''}
                                </span>
                            </Col>
                            <Col span={12}>
                                <span>类型：</span>
                                <span>{contractVo.typeStr}</span>
                            </Col>
                        </Row>
                        {contractVo.fixType === 2 && (
                            <Row span={24}>
                                <Col span={12}>
                                    <span>软件名称：</span>
                                    <span>{contractVo.softName}</span>
                                </Col>
                            </Row>
                        )}
                        {/* <Row span={24}>
                            <Col span={12}>
                                <span>用户评价：</span>
                                <Rate />
                            </Col>
                        </Row> */}
                        <Row span={24}>
                            <span>附件：</span>
                            <div className='img-box'>
                                {contractVo.photo.length > 0 ? (
                                    <div>
                                        {contractVo.photo.map((item, index) => {
                                            return (
                                                <img
                                                    key={index}
                                                    src={item}
                                                    alt=''
                                                    onClick={() => {
                                                        this.onPreviewImage(item)
                                                    }}
                                                />
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <span>无</span>
                                )}
                            </div>
                        </Row>
                        <div>
                            <Divider />
                            <Row span={24}>
                                <Col span={24}>
                                    <span style={{ verticalAlign: 'top' }}>维修方案：</span>
                                    <span style={{ width: '43rem', display: 'inline-block' }}>
                                        {contractVo.fixContent || '无'}
                                    </span>
                                </Col>
                            </Row>
                        </div>
                        {fixVo !== null && (
                            <div>
                                <Divider />
                                <Row span={24}>
                                    <Col span={12}>
                                        <span>工程师：</span>
                                        <span>{fixVo.fixName}</span>
                                    </Col>
                                    <Col span={12}>
                                        <span>订单状态：</span>
                                        <span>
                                            {orderDetailInfo.orderStatus === 1
                                                ? '已接单'
                                                : orderDetailInfo.orderStatus === 0
                                                ? '未接单'
                                                : orderDetailInfo.orderStatus === 2
                                                ? '已完成'
                                                : orderDetailInfo.orderStatus === 3
                                                ? '已取消'
                                                : ''}
                                        </span>
                                    </Col>
                                </Row>
                                <Row span={24}>
                                    <span>附件：</span>
                                    <div className='img-box'>
                                        {fixVo.photos.length > 0 ? (
                                            <div>
                                                {fixVo.photos.map((item, index) => {
                                                    return (
                                                        <img
                                                            key={index}
                                                            src={item}
                                                            alt=''
                                                            onClick={() => {
                                                                this.onPreviewImage(item)
                                                            }}
                                                        />
                                                    )
                                                })}
                                            </div>
                                        ) : (
                                            <span>无</span>
                                        )}
                                    </div>
                                </Row>
                            </div>
                        )}
                        {userDevice !== null && (
                            <div>
                                <Divider />
                                <p>设备详情:</p>
                                <Row span={24}>
                                    <Col span={12}>
                                        <span>CPU：</span>
                                        <span>{userDevice.cpu}</span>
                                    </Col>
                                    <Col span={12}>
                                        <span>硬盘：</span>
                                        <span>{userDevice.system}</span>
                                    </Col>
                                </Row>
                                <Row span={24}>
                                    <Col span={12}>
                                        <span>打印机：</span>
                                        <span>{userDevice.printer}</span>
                                    </Col>
                                    <Col span={12}>
                                        <span>内存：</span>
                                        <span>{userDevice.hardDisk}</span>
                                    </Col>
                                </Row>
                                <Row span={24}>
                                    <Col span={12}>
                                        <span>显卡：</span>
                                        <span>{userDevice.videoCard}</span>
                                    </Col>
                                    <Col span={12}>
                                        <span>主板：</span>
                                        <span>{userDevice.mainBoard}</span>
                                    </Col>
                                </Row>
                            </div>
                        )}
                    </div>
                </Modal>

                {/* 普通图片预览 */}
                <Modal
                    width={400}
                    visible={previewVisible}
                    title='预览'
                    footer={null}
                    centered
                    zIndex={3}
                    className='preview-image-modal'
                    onCancel={() => {
                        this.setState({ previewVisible: false })
                    }}>
                    <img alt='example' className='preview-image' src={previewImage} />
                </Modal>

                {/* 方案查询 */}
                <Modal
                    wrapClassName='repair-history-modal'
                    title='方案查询'
                    visible={planSearchVisible}
                    zIndex={2}
                    centered
                    onCancel={() => {
                        this.setState({ planSearchVisible: false })
                    }}
                    footer={null}>
                    <div className='rh-box scroll'>
                        {planList.length > 0 ? (
                            planList.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <p>{item.contentInfo}</p>
                                        {planList.length > 1 && <Divider />}
                                    </div>
                                )
                            })
                        ) : (
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        )}
                    </div>
                </Modal>
            </Layout>
        )
    }
}
