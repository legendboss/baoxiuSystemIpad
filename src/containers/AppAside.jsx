import React from 'react'
import PropTypes from 'prop-types'
import { Layout } from 'antd'
import CustomMenu from '@/components/CustomMenu'

const { Sider } = Layout

const AppAside = props => {
    let { menuToggle, menu } = props
    return (
        <Sider className='aside my-aside' collapsed={menuToggle}>
            <div className='logo'>
                logo公司名称
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
