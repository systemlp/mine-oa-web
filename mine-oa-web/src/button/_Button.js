import React, {Component} from 'react';
import {Button, DatePicker} from 'antd';

const {Group: ButtonGroup} = Button;
let loading;

export default class _Button extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true
        }
    }
    componentDidMount() {
        loading = setTimeout(() => {
            this.setState({
                loading: !this.state.loading
            });
        }, 2000);
    }
    componentWillUnmount(){
      clearTimeout(loading);
    }
    render() {
        return (
            <div>
                <DatePicker onChange={(value) => {
                  console.log( Date.now());
                }} disabledDate={(curDate) => {
                  return curDate && curDate.valueOf() > Date.now();
                }}/>
                <h1>按钮</h1>
                <dl>
                    <dt>
                        <h2>按钮类型</h2>
                    </dt>
                    <dd>
                        <Button type="primary">primary</Button>&nbsp;
                        <Button type="default">default</Button>&nbsp;
                        <Button type="dashed">dashed</Button>&nbsp;
                        <Button type="danger">danger</Button>&nbsp;
                        <Button type="primary" disabled>disabled</Button>
                    </dd>
                    <dt>
                        <h2>图标按钮</h2>
                    </dt>
                    <dd>
                        <Button type="primary" shape="circle" icon="search"/>&nbsp;
                        <Button type="primary" icon="search">search</Button>
                    </dd>
                    <dt>
                        <h2>按钮尺寸</h2>
                    </dt>
                    <dd>
                        <Button type="primary" size="large">large</Button>&nbsp;
                        <Button type="primary" size="default">defaule</Button>&nbsp;
                        <Button type="primary" size="small">small</Button>
                    </dd>
                    <dt>
                        <h2>加载状态按钮</h2>
                    </dt>
                    <dd>
                        <Button type="primary" loading={this.state.loading}>{this.state.loading
                                ? `loading`
                                : `加载完成`}</Button>
                    </dd>
                    <dt>
                        <h2>幽灵按钮</h2>
                    </dt>
                    <dd>
                        <Button type="primary" ghost>幽灵按钮</Button>
                    </dd>
                    <dt>
                        <h2>组合按钮</h2>
                    </dt>
                    <dd>
                        <ButtonGroup>
                            <Button>A</Button>
                            <Button>B</Button>
                            <Button>C</Button>
                        </ButtonGroup>
                    </dd>
                    <dt>
                        <h2>按钮点击事件</h2>
                    </dt>
                    <dd>
                        <Button type="primary" onClick={() => {
                            alert("是你在点我？");
                        }}>快来点我啊！！！</Button>
                    </dd>
                </dl>
            </div>
        )
    }
}
