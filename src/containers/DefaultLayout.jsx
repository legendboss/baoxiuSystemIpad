import React, { Component } from 'react'
import { Route, Switch, Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Layout, BackTop, message, Modal, Input } from 'antd'
import axios from '@/api'
import { APIPad, API } from '@/api/config'
import routes from '@/routes'
import { menuToggleAction } from '@/store/actionCreators'
// import avatar from '@/assets/images/user.jpg'
import menu from './menu'
import '@/style/layout.scss'

import AppHeader from './AppHeader.jsx'
import AppAside from './AppAside.jsx'
import AppFooter from './AppFooter.jsx'
import AppDataShow from './AppDataShow.jsx'

const { Content } = Layout
const uid = localStorage.getItem('uid')
const wsNewMessage = new WebSocket(`ws://203.156.231.107:8092/newMessage/${uid}`)
// const wsNewMessage = new WebSocket(`ws://qikeqike.qicp.vip/newMessage/${uid}`)
// const wsNewMessage = new WebSocket(`ws://172.16.2.218:8092/newMessage/${uid}`)

class DefaultLayout extends Component {
    state = {
        // avatar,
        userName: '',
        show: true,
        menu: [],
        dataShow: {},
        pwVisible: false,
        oldPwd: '',
        newPwd: '',
        reNewPwd: '',
        unReadInfo: 0
    }

    componentDidMount() {
        this.isLogin()
        // -------------------------------
        wsNewMessage.onopen = function(e) {
            console.log('连接上 wsNewMessage 服务端了')
            wsNewMessage.send({})
        }
        wsNewMessage.onmessage = msg => {
            console.log('接收服务端发过来的消息wsNewMessage: ', msg)
            document.getElementById('bgm').play()
            this.setState({
                unReadInfo: Number(msg.data)
            })
        }
        wsNewMessage.onclose = function(e) {
            console.log('wsNewMessage 连接关闭了')
            console.log(e)
        }
    }

    isLogin = () => {
        if (!localStorage.getItem('userName')) {
            this.props.history.push('/login')
        } else {
            // 获取头部数据
            this.getTopData()
            this.getUnReadCount()
            this.setState({
                userName: JSON.parse(localStorage.getItem('userName')),
                menu: this.getMenu(menu)
            })
        }
    }

    // 获取未读消息数量
    getUnReadCount = () => {
        axios
            .get(`${APIPad}/unReadCount`, {})
            .then(res => {
                if (res.data.code === 200) {
                    this.setState({
                        unReadInfo: res.data.data
                    })
                } else {
                    message.error(res.data.msg)
                }
            })
            .catch(err => {})
    }

    // 获取头部数据
    getTopData = () => {
        axios
            .get(`${API}/count`, {})
            .then(res => {
                if (res.data.code === 200) {
                    this.setState({
                        dataShow: res.data.data
                    })
                } else {
                    message.error(res.data.msg)
                }
            })
            .catch(err => {})
    }

    // 退出登录
    loginOut = () => {
        localStorage.removeItem('userName')
        localStorage.removeItem('token')
        this.props.history.push('/login')
        message.success('登出成功!')
    }

    // 未读消息跳转消息列表
    goToNewsList = () => {
        this.props.history.push('/newsList')
        this.setState({
            unReadInfo: 0
        })
    }

    modifyPassword = () => {
        this.setState({
            pwVisible: true
        })
    }

    getMenu = menu => {
        let newMenu,
            auth = JSON.parse(localStorage.getItem('userName')).auth
        if (!auth) {
            return menu
        } else {
            newMenu = menu.filter(res => res.auth && res.auth.indexOf(auth) !== -1)
            return newMenu
        }
    }

    // 旧密码输入
    onOldPwChange = e => {
        this.setState({ oldPwd: e.target.value })
    }

    // 新密码输入
    onNewPwChange = e => {
        this.setState({ newPwd: e.target.value })
    }

    // 确认密码输入
    onNewSurePwChange = e => {
        this.setState({ reNewPwd: e.target.value })
    }

    // model 确认
    cpHandleOk = () => {
        const { oldPwd, newPwd, reNewPwd } = this.state
        console.log(oldPwd, newPwd, reNewPwd)
        if (oldPwd === '') {
            message.error('请输入旧密码!')
            return false
        }
        if (newPwd === '') {
            message.error('请输入密码!')
            return false
        }
        if (reNewPwd === '') {
            message.error('请输入确认密码!')
            return false
        }
        if (newPwd !== reNewPwd) {
            message.error('两次输入的密码不一致，请重新输入!')
            return false
        }
        // TODO 掉接口
        axios
            .post(`${APIPad}/changPwd`, { oldPwd, newPwd, reNewPwd })
            .then(res => {
                if (res.data.code === 200) {
                    this.setState({ pwVisible: false })
                } else {
                    message.error(res.data.msg)
                }
            })
            .catch(err => {})
    }

    render() {
        const { userName, pwVisible, oldPwd, newPwd, reNewPwd, dataShow, unReadInfo } = this.state
        let { menuClick, menuToggle } = this.props
        let { auth } = JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : ''
        return (
            <Layout className='app'>
                <audio id='bgm'>
                    <source src='http://downsc.chinaz.net/Files/DownLoad/sound1/201706/8855.mp3' type='audio/mpeg' />
                </audio>
                <BackTop />
                <AppAside menuToggle={menuToggle} menu={this.state.menu} />
                <Layout style={{ marginLeft: menuToggle ? '54px' : '148px', minHeight: '100vh' }}>
                    <AppHeader
                        menuToggle={menuToggle}
                        menuClick={menuClick}
                        avatar={this.state.avatar}
                        userName={userName}
                        show={this.state.show}
                        loginOut={this.loginOut}
                        modifyPassword={this.modifyPassword}
                        unReadCount={unReadInfo}
                        goToNewsList={this.goToNewsList}
                    />
                    <Content className='content'>
                        <AppDataShow dataShow={dataShow} />
                        <Switch>
                            {routes.map(item => {
                                return (
                                    <Route
                                        key={item.path}
                                        path={item.path}
                                        exact={item.exact}
                                        render={props =>
                                            !auth ? (
                                                <item.component {...props} />
                                            ) : item.auth && item.auth.indexOf(auth) !== -1 ? (
                                                <item.component {...props} />
                                            ) : (
                                                // 这里也可以跳转到 403 页面
                                                <Redirect to='/404' {...props} />
                                            )
                                        }></Route>
                                )
                            })}
                            <Redirect to='/404' />
                        </Switch>
                    </Content>
                    <AppFooter />
                </Layout>
                <Modal
                    wrapClassName='change-password-modal'
                    title='修改密码'
                    visible={pwVisible}
                    onOk={this.cpHandleOk}
                    onCancel={() => {
                        this.setState({ pwVisible: false })
                    }}>
                    <div>
                        <div style={{ marginBottom: '25px' }}>
                            <label htmlFor=''>旧密码：</label>
                            <Input
                                placeholder='请输入旧密码'
                                type='password'
                                value={oldPwd}
                                onChange={this.onOldPwChange}
                            />
                        </div>
                        <div style={{ marginBottom: '25px' }}>
                            <label htmlFor=''>新密码：</label>
                            <Input
                                placeholder='请输入密码'
                                type='password'
                                value={newPwd}
                                onChange={this.onNewPwChange}
                            />
                        </div>
                        <div>
                            <label htmlFor=''>确认新密码：</label>
                            <Input
                                placeholder='请输入密码'
                                type='password'
                                value={reNewPwd}
                                onChange={this.onNewSurePwChange}
                            />
                        </div>
                    </div>
                </Modal>
            </Layout>
        )
    }
}

const stateToProp = state => ({
    menuToggle: state.menuToggle
})

const dispatchToProp = dispatch => ({
    menuClick() {
        dispatch(menuToggleAction())
    }
})

export default withRouter(connect(stateToProp, dispatchToProp)(DefaultLayout))
