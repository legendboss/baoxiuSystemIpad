import React from 'react'
import ReactDOM from 'react-dom'
import { ConfigProvider } from 'antd';
import App from './App'
import { Provider } from 'react-redux'
import store from './store'
import zhCN from 'antd/es/locale/zh_CN';

const AppView = (
    <Provider store={store} >
    <ConfigProvider locale={zhCN}>
        <App />
    </ConfigProvider>
    </Provider>
)

ReactDOM.render(AppView, document.getElementById('root'))
