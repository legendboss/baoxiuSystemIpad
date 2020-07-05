import React, { Component } from 'react'
import { Layout, DatePicker, Select, Spin, Radio, message } from 'antd'
import '@/style/view-style/report.scss'
import locale from 'antd/es/date-picker/locale/zh_CN'
import debounce from 'lodash/debounce'
import BarEcharts from './Bar.jsx'
import PieEcharts from './Pie.jsx'
import axios from '@/api'
import { API } from '@/api/config'
import moment from 'moment'

const { Option } = Select
const { RangePicker } = DatePicker
const dateFormat = 'YYYY-MM-DD'
// 默认选择时间为最近7天
const defaultSelectDate = {
    startDate: moment()
        .startOf('day')
        .subtract(6, 'days'),
    endDate: moment().endOf('day')
}

export default class Report extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dateTime: [
                defaultSelectDate.startDate.format('YYYY-MM-DD'),
                defaultSelectDate.endDate.format('YYYY-MM-DD')
            ],
            orderStatus: '',
            engineerValue: [],
            engineerList: [],
            engineerFetching: false,
            tabStatus: 'a',
            barData: [],
            pieData: [],
            echartsName: '维修单统计'
        }
        this.fetchEngineer = debounce(this.fetchEngineer, 800)
    }

    componentDidMount() {
        this.getFixOrderReport()
    }

    // 工程师select
    fetchEngineer = value => {
        this.setState({ engineerList: [], engineerFetching: true })
        const model = {
            name: value,
            role: 1
        }
        axios
            .get(`${API}/UserListMenu`, { params: model })
            .then(res => {
                const Data = res.data.data
                if (res.data.code === 200) {
                    if (Data.length > 0) {
                        this.setState({ engineerList: Data, engineerFetching: false })
                    } else {
                        this.setState({
                            engineerValue: [{ value }],
                            engineerList: [{ id: 0, name: value }],
                            engineerFetching: false
                        })
                    }
                } else {
                    message.error(res.data.msg)
                }
            })
            .catch(err => {})
    }

    engineerChange = value => {
        this.setState(
            {
                engineerValue: value,
                engineerList: [],
                engineerFetching: false
            },
            () => {
                this.onFuncCheck()
            }
        )
    }

    // 时间选择
    onRageChange = (dates, dateStrings) => {
        const dateTime = [dateStrings[0], dateStrings[1]]
        this.setState(
            {
                dateTime
            },
            () => {
                this.onFuncCheck()
            }
        )
    }

    // 订单状态
    statusChange = e => {
        this.setState(
            {
                orderStatus: e
            },
            () => {
                this.onFuncCheck()
            }
        )
    }

    // tab切换
    onTabChange = e => {
        this.setState(
            {
                tabStatus: e.target.value
            },
            () => {
                this.onFuncCheck()
            }
        )
    }

    // 方法判断
    onFuncCheck = () => {
        const { tabStatus } = this.state
        if (tabStatus === 'a') {
            this.getFixOrderReport()
        } else if (tabStatus === 'b') {
            this.getFromReport()
        } else if (tabStatus === 'c') {
            this.getAvgResponseReport()
        } else if (tabStatus === 'd') {
            this.getAvgFinishReport()
        } else if (tabStatus === 'e') {
            this.getScoreCountReport()
        }
    }

    // 维修单统计报表
    getFixOrderReport = () => {
        const { dateTime, orderStatus, engineerValue } = this.state
        const model = {
            start: dateTime[0],
            end: dateTime[1],
            orderStatus,
            fixId: engineerValue ? engineerValue.key : '' // 工程师
        }
        axios
            .get(`${API}/fixOrderCount`, { params: model })
            .then(res => {
                const barDataArr = res.data.data
                const barData1 = []
                const barData2 = []
                if (res.data.code === 200) {
                    barDataArr.forEach(item => {
                        barData1.push(item.count)
                        barData2.push(item.dataStr)
                    })
                    this.setState({
                        barData: [barData1, barData2],
                        echartsName: '维修单统计'
                    })
                } else {
                    message.error(res.data.msg)
                }
            })
            .catch(err => {})
    }

    // 来源渠道统计报表
    getFromReport = () => {
        const { dateTime, engineerValue } = this.state
        const model = {
            start: dateTime[0],
            end: dateTime[1],
            fixId: engineerValue ? engineerValue.key : '' // 工程师
        }
        axios
            .get(`${API}/fromCount`, { params: model })
            .then(res => {
                if (res.data.code === 200) {
                    const pieDataArr = res.data.data
                    const pieData = []
                    pieDataArr.forEach(item => {
                        const obj = {
                            value: item.count,
                            name: item.from
                        }
                        pieData.push(obj)
                    })
                    this.setState({
                        pieData,
                        echartsName: '来源渠道统计'
                    })
                } else {
                    message.error(res.data.msg)
                }
            })
            .catch(err => {})
    }

    // 平均响应时间统计报表
    getAvgResponseReport = () => {
        const { dateTime, engineerValue } = this.state
        const model = {
            start: dateTime[0],
            end: dateTime[1],
            fixId: engineerValue ? engineerValue.key : '' // 工程师
        }
        axios
            .get(`${API}/avgResponseTime`, { params: model })
            .then(res => {
                const barDataArr = res.data.data
                const barData1 = []
                const barData2 = []
                if (res.data.code === 200) {
                    barDataArr.forEach(item => {
                        barData1.push(item.count)
                        barData2.push(item.dataStr)
                    })
                    this.setState({
                        barData: [barData1, barData2],
                        echartsName: '平均响应时间统计'
                    })
                } else {
                    message.error(res.data.msg)
                }
            })
            .catch(err => {})
    }

    // 平均完成时间统计报表
    getAvgFinishReport = () => {
        const { dateTime, engineerValue } = this.state
        const model = {
            start: dateTime[0],
            end: dateTime[1],
            fixId: engineerValue ? engineerValue.key : '' // 工程师
        }
        axios
            .get(`${API}/avgFinishTime`, { params: model })
            .then(res => {
                const barDataArr = res.data.data
                const barData1 = []
                const barData2 = []
                if (res.data.code === 200) {
                    barDataArr.forEach(item => {
                        barData1.push(item.count)
                        barData2.push(item.dataStr)
                    })
                    this.setState({
                        barData: [barData1, barData2],
                        echartsName: '平均完成时间统计'
                    })
                } else {
                    message.error(res.data.msg)
                }
            })
            .catch(err => {})
    }

    // 评价统计报表
    getScoreCountReport = () => {
        const { dateTime, engineerValue } = this.state
        const model = {
            start: dateTime[0],
            end: dateTime[1],
            fixId: engineerValue ? engineerValue.key : '' // 工程师
        }
        axios
            .get(`${API}/scoreCount`, { params: model })
            .then(res => {
                const pieDataArr = res.data.data
                const pieData = []
                pieDataArr.forEach(item => {
                    const obj = {
                        value: item.count,
                        name: item.from
                    }
                    pieData.push(obj)
                })
                this.setState({
                    pieData,
                    echartsName: '评价统计'
                })
            })
            .catch(err => {})
    }

    render() {
        const { engineerValue, engineerList, engineerFetching, tabStatus, barData, echartsName, pieData } = this.state
        return (
            <Layout className='report animated fadeIn'>
                <div className='report-box'>
                    <div>
                        <label htmlFor='工程师'>工程师: </label>
                        <Select
                            showSearch
                            allowClear
                            placeholder=''
                            labelInValue
                            value={engineerValue}
                            notFoundContent={engineerFetching ? <Spin size='small' /> : null}
                            filterOption={false}
                            onSearch={this.fetchEngineer}
                            onChange={this.engineerChange}>
                            {engineerList.map(d => (
                                <Option key={d.id}>{d.name}</Option>
                            ))}
                        </Select>
                        <label htmlFor='时间'>时间: </label>
                        <RangePicker
                            defaultValue={[
                                moment(defaultSelectDate.startDate, dateFormat),
                                moment(defaultSelectDate.endDate, dateFormat)
                            ]}
                            format='YYYY-MM-DD'
                            showTime
                            locale={locale}
                            onChange={this.onRageChange}
                        />
                        {tabStatus === 'a' && (
                            <div style={{ display: 'inline-block' }}>
                                <label htmlFor='订单状态'>订单状态: </label>
                                <Select defaultValue='' style={{ width: 200 }} onChange={this.statusChange}>
                                    <Option value=''>全部</Option>
                                    <Option value='0'>未接单</Option>
                                    <Option value='1'>已接单</Option>
                                    <Option value='2'>已完成</Option>
                                    <Option value='3'>已取消</Option>
                                </Select>
                            </div>
                        )}
                    </div>
                    <div>
                        <Radio.Group defaultValue='a' style={{ marginTop: 40 }} onChange={this.onTabChange}>
                            <Radio.Button value='a'>维修单统计</Radio.Button>
                            <Radio.Button value='b'>来源渠道统计</Radio.Button>
                            <Radio.Button value='c'>平均响应时间统计</Radio.Button>
                            <Radio.Button value='d'>平均完成时间统计</Radio.Button>
                            <Radio.Button value='e'>评价率统计</Radio.Button>
                        </Radio.Group>
                    </div>
                    {tabStatus === 'b' || tabStatus === 'e' ? (
                        <div>
                            <PieEcharts pieData={pieData} name={echartsName} />
                        </div>
                    ) : (
                        <div>
                            <BarEcharts barData={barData} name={echartsName} />
                        </div>
                    )}
                </div>
            </Layout>
        )
    }
}
