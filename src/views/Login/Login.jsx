import React, { Component } from 'react'
import { Layout, Input, Form, Button, message } from 'antd'
// import { withRouter } from 'react-router-dom'
import axios from '@/api'
import { API } from '@/api/config'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import '@/style/view-style/login.scss'

class Login extends Component {
    state = {
        loading: false
    }

    // 登录
    onFinish = values => {
        console.log(values)
        const { account, password } = values
        this.setState({ loading: true })
        axios
            .post(`${API}/Login`, { account, password })
            .then(res => {
                console.log(res.data.code)
                if (res.data.code === 200) {
                    localStorage.setItem('userName', JSON.stringify(res.data.data.userName))
                    localStorage.setItem('token', res.data.data.token)
                    this.props.history.push('/')
                    message.success('登录成功!')
                } else {
                    // 这里处理一些错误信息
                    message.error(res.data.msg)
                }
            })
            .catch(err => {})
        
            this.setState({ loading: false })
        // // 这里可以做权限校验 模拟接口返回用户权限标识
        // switch (e.account) {
        //     case 'admin':
        //         e.auth = 0
        //         break
        //     default:
        //         e.auth = 1
        // }
        
        values.auth = 1
      
    }

    componentDidMount() {
        
    }

    render() {
        const { loading } = this.state
        return (
            <Layout className='login animated fadeIn'>
                <div className='model'>
                    <div className='login-form'>
                        <Form onFinish={this.onFinish}>
                            <Form.Item
                                name="account"
                                rules= {[{ required: true, message: '请输入账户名!' }]}
                            >
                                <Input
                                    prefix={<UserOutlined className="site-form-item-icon" />}
                                    placeholder='账户'
                                    autoComplete="off"
                                />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules= {[{ required: true, message: '请输入密码！' }]}
                            >
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    type='password'
                                    placeholder='密码'
                                    autoComplete="off"
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    type='primary'
                                    htmlType='submit'
                                    className='login-form-button'
                                    loading={loading}>
                                    登录
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default Login
