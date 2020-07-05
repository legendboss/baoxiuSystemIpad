import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Dropdown, Layout, Avatar } from 'antd'
import { UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'

const { Header } = Layout

const AppHeader = props => {
    let { menuClick, avatar, userName, menuToggle, modifyPassword } = props
    const menu = (
        <Menu>
            <Menu.Item onClick={modifyPassword}>
                <span>修改密码</span>
            </Menu.Item>
            {/* <Menu.Item>
                <span onClick={loginOut}>
                    退出登录
                </span>
            </Menu.Item> */}
        </Menu>
    )
    return (
        <Header className='header'>
            <div className='left'>
                {menuToggle ? <MenuUnfoldOutlined onClick={menuClick} /> : <MenuFoldOutlined onClick={menuClick} />}
            </div>
            <div className='right'>
                {/* <div className='mr15'>
                    <Badge dot={true} offset={[-2, 0]}>
                        <a href='https://github.com/ltadpoles/react-admin' style={{ color: '#000' }}>
                            <BellOutlined />
                        </a>
                    </Badge>
                </div> */}
                <div>
                    <Dropdown overlay={menu} overlayStyle={{ width: '20rem' }}>
                        <div className='ant-dropdown-link'>
                            <Avatar icon={<UserOutlined />} src={avatar} alt='avatar' style={{ cursor: 'pointer' }} />
                            <span className='user-name'>{userName}</span>
                        </div>
                    </Dropdown>
                </div>
            </div>
        </Header>
    )
}

AppHeader.propTypes = {
    menuClick: PropTypes.func,
    avatar: PropTypes.string,
    menuToggle: PropTypes.bool,
    loginOut: PropTypes.func,
    modifyPassword: PropTypes.func
}

export default React.memo(AppHeader)
