import React, {Component} from 'react';
import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';

export default class ECharts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartOption: {
                title: {
                    text: 'ECharts 入门示例'
                },
                legend: {
                    data: [
                        '理想等级人数', '实际等级人数'
                    ],
                    bottom: 'bottom'
                },
                tooltip: {},
                xAxis: {
                    data: ["S", "A", "B", "C"]
                },
                yAxis: {name:'（单位：人）'},
                series: [
                    {
                        name: '理想等级人数',
                        label: {
                            normal: {
                                show: true,
                                textStyle: {
                                    fontSize: 20,
                                    fontWeight: 'bold'
                                },
                                formatter: '{c}人'
                            }
                        },
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                color: '#ccc'
                            }
                        },
                        data: [5, 20, 36, 10]
                    }, {
                        name: '实际等级人数',
                        type: 'bar',
                        barCategoryGap: '36%',
                        label: {
                            normal: {
                                show: true,
                                textStyle: {
                                    fontSize: 20,
                                    fontWeight: 'bold'
                                },
                                formatter: '{c}人'
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#999'
                            }
                        },
                        data: [5, 20, 36, 10]
                    }
                ]
            }
        }
    }
    componentDidMount() {
        let myChart = echarts.init(this.refs.chart);
        // 绘制图表
        myChart.setOption(this.state.chartOption);
    }
    render() {
        return (
            <div>
                <div ref="chart" style={{
                    width: 800,
                    height: 500
                }}></div>
                <ReactEcharts option={this.state.chartOption} style={{
                    width: 800,
                    height: 500
                }}/>
            </div>
        )
    }

}
