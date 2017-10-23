import 'antd/dist/antd.css';
import './userData.css';
import React, {Component} from 'react';
import {Row, Col, message} from 'antd';
import {fetchUtil} from '../../utils/fetchUtil'

class UserData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: {}
        }
    }
    componentWillMount() {
        fetchUtil({
            url: '/user/findDataByUserName',
            callBack: (result) => {
                if (result.code === 200) {
                    this.setState({userData: result.data});
                } else {
                    message.error(result.msg);
                }
            }
        });
    }
    render() {
        const {userName, email, name, sex, cardType, cardNo, mobile, address, deptName, posName} = this.state.userData;
        return (
            <div className="userData">
                <h2>个人资料</h2>
                <Row type="flex" justify="center" align="middle">
                    <Col span={8}>
                        <Col span={4}>
                            <label>用户名：</label>
                        </Col>
                        <Col span={20}>
                            <span>{userName}</span>
                        </Col>
                    </Col>
                    <Col span={8}>
                        <Col span={4}>
                            <label>邮箱：</label>
                        </Col>
                        <Col span={20}>
                            <span>{email}</span>
                        </Col>
                    </Col>
                </Row>
                <Row type="flex" justify="center" align="middle">
                    <Col span={8}>
                        <Col span={4}>
                            <label>姓名：</label>
                        </Col>
                        <Col span={20}>
                            <span>{name}</span>
                        </Col>
                    </Col>
                    <Col span={8}>
                        <Col span={4}>
                            <label>性别：</label>
                        </Col>
                        <Col span={20}>
                            <span>{sex===0?'女':sex === 1?'男':'未知'}</span>
                        </Col>
                    </Col>
                </Row>
                <Row type="flex" justify="center" align="middle">
                    <Col span={8}>
                        <Col span={4}>
                            <label>证件类型：</label>
                        </Col>
                        <Col span={20}>
                            <span>{cardType===1?'身份证':cardType === 2?'护照':'未知'}</span>
                        </Col>
                    </Col>
                    <Col span={8}>
                        <Col span={4}>
                            <label>证件号：</label>
                        </Col>
                        <Col span={20}>
                            <span>{cardNo}</span>
                        </Col>
                    </Col>
                </Row>
                <Row type="flex" justify="center" align="middle">
                    <Col span={8}>
                        <Col span={4}>
                            <label>手机号：</label>
                        </Col>
                        <Col span={20}>
                            <span>{mobile}</span>
                        </Col>
                    </Col>
                    <Col span={8}>
                        <Col span={4}>
                            <label>地址：</label>
                        </Col>
                        <Col span={20}>
                            <span>{address}</span>
                        </Col>
                    </Col>
                </Row>
                <Row type="flex" justify="center" align="middle">
                    <Col span={8}>
                        <Col span={4}>
                            <label>所属部门：</label>
                        </Col>
                        <Col span={20}>
                            <span>{deptName}</span>
                        </Col>
                    </Col>
                    <Col span={8}>
                        <Col span={4}>
                            <label>职位：</label>
                        </Col>
                        <Col span={20}>
                            <span>{posName}</span>
                        </Col>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default UserData;
