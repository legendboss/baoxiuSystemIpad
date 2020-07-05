import React, { Component } from 'react'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'

class Bar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            barData: []
        }
    }
    // componentWillReceiveProps(){
    //     this.setState({
    //         barData: this.props.barData,
    //         echartsName: this.props.name
    //     }, ()=> {
    //         this.initEcharts()
    //     })
    // }

    componentDidUpdate() {
        this.initEcharts(this.props)
    }

    initEcharts = props => {
        const { barData, name } = props
        let myChart = echarts.init(document.getElementById('bar'))
        myChart.setOption({
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: barData[1]
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: name,
                    type: 'bar',
                    barWidth: 65,
                    data: barData[0],
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(
                                0,
                                1,
                                0,
                                0, //4个参数用于配置渐变色的起止位置, 这4个参数依次对应右/下/左/上四个方位. 而0 1 0 0则代表渐变色从正下方开始
                                [
                                    { offset: 0, color: '#1573FF' },
                                    { offset: 1, color: '#2FABFF' }
                                ] //数组, 用于配置颜色的渐变过程. 每一项为一个对象, 包含offset和color两个参数. offset的范围是0 ~ 1, 用于表示柱状图的位置
                            )
                        }
                    }
                }
            ]
        })
        window.addEventListener('resize', function() {
            myChart.resize()
        })
    }
    render() {
        return <div id='bar' style={{ width: 700, height: 500, background: '#fff', margin: '65px auto' }}></div>
    }
}

export default Bar
