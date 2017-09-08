import React, {Component} from 'react';
import {Calendar} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

let setCurTime;
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            curTime: moment().format('a hh:mm:ss')
        }
    }
    componentDidMount() {
        setCurTime = setInterval(() => {
            this.setState({curTime: moment().format('a hh:mm:ss')})
        }, 1000);
    }
    componentWillUnmount() {
        clearInterval(setCurTime);
    }
    render() {
        return (
            <div>
                <h1 style={{
                    display: 'inline-block'
                }}>我就是首页</h1>
                <h3 style={{
                    display: 'inline-block',
                    marginLeft: 10
                }}>{this.state.curTime}</h3>
                <Calendar/>
            </div>
        )
    }
}

export default Home;
