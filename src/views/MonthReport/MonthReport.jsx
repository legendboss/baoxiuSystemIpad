import React, { Component } from 'react'
import { Layout, message, Form, Input, Button, InputNumber, DatePicker } from 'antd'
import locale from 'antd/es/date-picker/locale/zh_CN'
import '@/style/view-style/monthReport.scss'
import axios from '@/api'
import { APIPad } from '@/api/config'

class MonthReport extends Component {
    state = {
        isUpLoad: false,
        saveLoading: false
    }

    componentDidMount() {
        this.getMonthReportIsUpLoad()
    }

    // 判断月报是否需要上传
    getMonthReportIsUpLoad = () => {
        axios
            .get(`${APIPad}/monthReportIsUpLoad`, {})
            .then(res => {
                const data = res.data.data
                if (res.data.code === 200) {
                    this.setState({
                        isUpLoad: data
                    })
                } else {
                    message.error(res.data.msg)
                }
            })
            .catch(err => {})
    }

    // 保存月报
    onFinish = values => {
        console.log(values)
        values.date = values.date.format('YYYY-MM-DD')
        this.setState({ loading: true })
        axios
            .delete(`${APIPad}/monthReport`, { params: { ...values } })
            .then(res => {
                console.log(res.data.code)
                if (res.data.code === 200) {
                    message.success('保存成功!')
                } else {
                    message.error(res.data.msg)
                }
                this.setState({ loading: false })
            })
            .catch(err => {
                this.setState({ loading: false })
            })
    }

    render() {
        const { saveLoading, isUpLoad } = this.state
        return (
            <Layout className='monthReport animated fadeIn'>
                <div className='newsList-box'>
                    <Form layout='horizontal' labelCol={{ span: 8 }} wrapperCol={{ span: 8 }} onFinish={this.onFinish}>
                        <Form.Item
                            label='本月完成量'
                            name='total'
                            rules={[{ required: true, message: '请输入本月完成量!' }]}>
                            <InputNumber
                                style={{ width: '160px' }}
                                placeholder='请输入本月完成量'
                                autoComplete='off'
                                disabled={!isUpLoad}
                            />
                        </Form.Item>
                        <Form.Item
                            label='自我评价'
                            name='selfEvaluation'
                            rules={[{ required: true, message: '请输入自我评价！' }]}>
                            <Input.TextArea placeholder='请输入自我评价！' autoComplete='off' disabled={!isUpLoad} />
                        </Form.Item>
                        <Form.Item label='日期' name='date' rules={[{ required: true, message: '请选择日期！' }]}>
                            <DatePicker inputReadOnly locale={locale} style={{ width: '160px' }} disabled={!isUpLoad} />
                        </Form.Item>
                        <Form.Item
                            label='外派记录'
                            name='outReport'
                            rules={[{ required: true, message: '请输入外派记录！' }]}>
                            <Input.TextArea placeholder='请输入外派记录！' autoComplete='off' disabled={!isUpLoad} />
                        </Form.Item>
                        <Form.Item
                            label='问题难点分析'
                            name='question'
                            rules={[{ required: true, message: '请输入问题难点分析！' }]}>
                            <Input.TextArea
                                placeholder='请输入问题难点分析！'
                                autoComplete='off'
                                disabled={!isUpLoad}
                            />
                        </Form.Item>
                        <Form.Item
                            label='经验分享'
                            name='suggestion'
                            rules={[{ required: true, message: '请输入经验分享！' }]}>
                            <Input.TextArea placeholder='请输入经验分享！' autoComplete='off' disabled={!isUpLoad} />
                        </Form.Item>
                        <Form.Item label='总结' name='summary' rules={[{ required: true, message: '请输入总结！' }]}>
                            <Input.TextArea placeholder='请输入总结！' autoComplete='off' disabled={!isUpLoad} />
                        </Form.Item>
                        <Form.Item wrapperCol={{ span: 24 }}>
                            <Button
                                type='primary'
                                htmlType='submit'
                                className='save-form-button'
                                disabled={saveLoading || !isUpLoad}
                                loading={saveLoading}>
                                提交
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Layout>
        )
    }
}

export default MonthReport
