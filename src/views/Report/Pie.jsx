import React, { Component } from 'react'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'

class Pie extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pieData: []
        }
    }

    componentDidUpdate() {
        this.initEcharts(this.props)
    }

    initEcharts = props => {
        const { pieData, name } = props
        let myChart = echarts.init(document.getElementById('pie'))
        myChart.setOption({
            color: ['#1074FF', '#16E8FF', '#008D89', '#006D94'],
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            series: [
                {
                    name: name,
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '50%'],
                    data: pieData,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
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
        return <div id='pie' style={{ width: '600px', height: '500px', margin: '100px auto' }}></div>
    }
}

export default Pie
