import React from 'react'
import PropTypes from 'prop-types'
import { Layout } from 'antd'
import CustomMenu from '@/components/CustomMenu'

import logo from '@/assets/images/logo.jpg'

const { Sider } = Layout

const AppAside = props => {
    let { menuToggle, menu } = props
    return (
        <Sider width={148} collapsedWidth={54} className='aside my-aside' collapsed={menuToggle}>
            <div className='logo'>
                <a href='#/index'>
                    <img src={logo} alt='' />
                </a>
            </div>
            <CustomMenu menu={menu}></CustomMenu>
        </Sider>
    )
}

AppAside.propTypes = {
    menuToggle: PropTypes.bool,
    menu: PropTypes.array.isRequired
}

export default AppAside
