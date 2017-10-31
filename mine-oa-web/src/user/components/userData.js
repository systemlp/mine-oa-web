import 'antd/dist/antd.css';
import './userData.css';
import React, {Component} from 'react';
import {Row, Col, message} from 'antd';
import {fetchUtil} from '../../utils/fetchUtil';

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
                    <Col span={10}>
                      <label>用户名：</label>
                      <span>{userName}</span>
                    </Col>
                    <Col span={10}>
                      <label>邮箱：</label>
                      <span>{email}</span>
                    </Col>
                </Row>
                <Row type="flex" justify="center" align="middle">
                    <Col span={10}>
                      <label>姓名：</label>
                      <span>{name}</span>
                    </Col>
                    <Col span={10}>
                      <label>性别：</label>
                      <span>{sex===0?'女':sex === 1?'男':'未知'}</span>
                    </Col>
                </Row>
                <Row type="flex" justify="center" align="middle">
                    <Col span={10}>
                        <label>证件类型：</label>
                        <span>{cardType===1?'身份证':cardType === 2?'护照':'未知'}</span>
                    </Col>
                    <Col span={10}>
                      <label>证件号：</label>
                      <span>{cardNo}</span>
                    </Col>
                </Row>
                <Row type="flex" justify="center" align="middle">
                    <Col span={10}>
                      <label>手机号：</label>
                      <span>{mobile}</span>
                    </Col>
                    <Col span={10}>
                      <label>地址：</label>
                      <span>{address}</span>
                    </Col>
                </Row>
                <Row type="flex" justify="center" align="middle">
                    <Col span={10}>
                      <label>所属部门：</label>
                      <span>{deptName}</span>
                    </Col>
                    <Col span={10}>
                      <label>职位：</label>
                      <span>{posName}</span>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default UserData;
