import './grid.css';
import React, {Component} from 'react';
import {Row, Col} from 'antd';

const DemoBox = ((props) => {
    return (
        <div style={{
            height: props.height
        }}>{props.children}</div>
    )
})

export default class _Grid extends Component {
    render() {
        return (
            <div>
                <h1>24 栅格系统</h1>
                <dl>
                    <dt>
                        <h2>基础栅格</h2>
                    </dt>
                    <dd>
                        <Row>
                            <Col span={12}>col-12</Col>
                            <Col span={12}>col-12</Col>
                        </Row>
                        <Row>
                            <Col span={8}>col-8</Col>
                            <Col span={8}>col-8</Col>
                            <Col span={8}>col-8</Col>
                        </Row>
                        <Row>
                            <Col span={6}>col-6</Col>
                            <Col span={6}>col-6</Col>
                            <Col span={6}>col-6</Col>
                            <Col span={6}>col-6</Col>
                        </Row>
                    </dd>
                </dl>
                <dl>
                    <dt>
                        <h2>区块间隔</h2>
                        <h3>原理：给Col加上左右padding，padding的值为gutter/2，antd推荐（16+8*n）px，背景色为Col的第一级子元素</h3>
                    </dt>
                    <dd>
                        <div className="gutter-example">
                            <Row gutter={20}>
                                <Col span={6}>
                                    <div className="gutter-box">col-6</div>
                                </Col>
                                <Col span={6}>
                                    <div className="gutter-box">col-6</div>
                                </Col>
                                <Col span={6}>
                                    <div className="gutter-box">col-6</div>
                                </Col>
                                <Col span={6}>
                                    <div className="gutter-box">col-6</div>
                                </Col>
                            </Row>
                        </div>
                    </dd>
                </dl>
                <dl>
                    <dt>
                        <h2>左右偏移</h2>
                        <h3>原理：给Col加上margin-left</h3>
                    </dt>
                    <dd>
                        <Row>
                            <Col span={8}>col-8</Col>
                            <Col span={8} offset={8}>col-8向右偏移了8个格子</Col>
                        </Row>
                    </dd>
                </dl>
                <dl>
                    <dt>
                        <h2>栅格排序</h2>
                        <h3>原理：利用绝对定位给Col加上left或right已实现排序,push-left,pull-right</h3>
                    </dt>
                    <dd>
                        <Row>
                            <Col span={8} push={16}>col-8</Col>
                            <Col span={16} pull={8}>col-16</Col>
                        </Row>
                    </dd>
                </dl>
                <dl>
                    <dt>
                        <h2>flex布局</h2>
                        <h3>原理：使用flex布局，justify-content控制元素对齐方式</h3>
                    </dt>
                    <dd>
                        <code>justify="start" justify-content: flex-start;</code>
                        <Row type="flex" justify="start">
                            <Col span={6}>col-6</Col>
                            <Col span={6}>col-6</Col>
                            <Col span={6}>col-6</Col>
                        </Row>
                        <code>justify="center" justify-content: center;</code>
                        <Row type="flex" justify="center">
                            <Col span={6}>col-6</Col>
                            <Col span={6}>col-6</Col>
                            <Col span={6}>col-6</Col>
                        </Row>
                        <code>justify="end" justify-content: flex-end;</code>
                        <Row type="flex" justify="end">
                            <Col span={6}>col-6</Col>
                            <Col span={6}>col-6</Col>
                            <Col span={6}>col-6</Col>
                        </Row>
                        <code>justify="space-between" justify-content: space-between;</code>
                        <Row type="flex" justify="space-between">
                            <Col span={6}>col-6</Col>
                            <Col span={6}>col-6</Col>
                            <Col span={6}>col-6</Col>
                        </Row>
                        <code>justify="space-around" justify-content: space-around;</code>
                        <Row type="flex" justify="space-around">
                            <Col span={6}>col-6</Col>
                            <Col span={6}>col-6</Col>
                            <Col span={6}>col-6</Col>
                        </Row>
                    </dd>
                </dl>
                <dl>
                    <dt>
                        <h2>flex布局</h2>
                        <h3>原理：使用flex布局，align-items控制元素垂直对齐方式</h3>
                    </dt>
                    <dd className="align-items">
                        <code>align="top" align-items: flex-start;</code>
                        <Row type="flex" justify="start" align="top">
                            <Col span={6}>
                                <DemoBox height={100}>col-6</DemoBox>
                            </Col>
                            <Col span={6}>
                                <DemoBox height={60}>col-6</DemoBox>
                            </Col>
                            <Col span={6}>
                                <DemoBox height={80}>col-6</DemoBox>
                            </Col>
                        </Row>
                        <code>align="middle" align-items: center;</code>
                        <Row type="flex" justify="center" align="middle">
                            <Col span={6}>
                                <DemoBox height={100}>col-6</DemoBox>
                            </Col>
                            <Col span={6}>
                                <DemoBox height={60}>col-6</DemoBox>
                            </Col>
                            <Col span={6}>
                                <DemoBox height={80}>col-6</DemoBox>
                            </Col>
                        </Row>
                        <code>align="bottom" align-items: flex-end;</code>
                        <Row type="flex" justify="end" align="bottom">
                            <Col span={6}>
                                <DemoBox height={100}>col-6</DemoBox>
                            </Col>
                            <Col span={6}>
                                <DemoBox height={60}>col-6</DemoBox>
                            </Col>
                            <Col span={6}>
                                <DemoBox height={80}>col-6</DemoBox>
                            </Col>
                        </Row>
                    </dd>
                </dl>
                <dl>
                    <dt>
                        <h2>flex排序</h2>
                        <h3>原理：使用flex布局，order属性控制元素顺序</h3>
                    </dt>
                    <dd>
                        <Row type="flex">
                            <Col span={6} order={3}>1 col-order-3</Col>
                            <Col span={6} order={2}>2 col-order-2</Col>
                            <Col span={6} order={4}>3 col-order-4</Col>
                            <Col span={6} order={1}>4 col-order-1</Col>
                        </Row>
                    </dd>
                </dl>
                <dl>
                    <dt>
                        <h2>响应式布局</h2>
                        <h3>原理：根据浏览器宽度区间使用指定的样式</h3>
                    </dt>
                    <dd>
                        <code>
                          响应式栅格，可为栅格数或一个包含其他属性的对象，对象属性为col属性<br/>
                          xs&lt;768px | sm	≥768px | md	≥992px | lg	≥1200px | xl	≥1600px
                        </code>
                        <Row>
                            <Col xs={2} sm={4} md={6} lg={8} xl={10}>Col</Col>
                            <Col xs={20} sm={16} md={12} lg={8} xl={4}>Col</Col>
                            <Col xs={2} sm={4} md={6} lg={8} xl={10}>Col</Col>
                        </Row>
                    </dd>
                </dl>
            </div>
        )
    }
}
