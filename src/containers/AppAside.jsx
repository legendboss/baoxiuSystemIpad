import React from 'react'
import PropTypes from 'prop-types'
import { Layout } from 'antd'
import CustomMenu from '@/components/CustomMenu'

const { Sider } = Layout

const AppAside = props => {
    let { menuToggle, menu } = props
    return (
        <Sider width={148} collapsedWidth={54} className='aside my-aside' collapsed={menuToggle}>
            <div className='logo'>
                <a href='#/index'>logo公司名称</a>
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
