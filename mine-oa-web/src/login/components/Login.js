import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';
// import { bindActionCreators } from 'redux';
import {
    Row,
    Col,
    Icon,
    Input,
    Button,
    Alert
} from 'antd';
import './login.css';
import {login} from '../redux/actions/login';

const errMsg = {
    nameEmpty: {
        title: 'nameEmpty',
        msg: '请输入用户名'
    },
    passwordEmpty: {
        title: 'passwordEmpty',
        msg: '请输入密码'
    },
    error: {
        title: 'error',
        msg: '用户名或密码错误'
    }
};

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            password: '',
            errMsg: null,
            // user: {},
        }
    }
    handledLogin = () => {
        const {userName, password} = this.state;
        const {dispatch, onLogin, user} = this.props;
        if (!userName) {
            this.setState({errMsg: errMsg.nameEmpty});
        } else if (!password) {
            this.setState({errMsg: errMsg.passwordEmpty});
        } else {
            fetch('http://localhost:8080/user/login', {
                method: 'post',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({userName, password})
            }).then(res => {
                res.json().then(data => {
                    if (data.code === 200) {
                        onLogin({userName, password});
                        browserHistory.push('/');
                    } else {
                        this.setState({errMsg: {
                            title: 'error',
                            msg: data.msg
                        }});
                    }
                });
            });
            // if (userName === 'admin' && password === '123456') {
            //     onLogin({userName, password});
            //     browserHistory.push('/');
            // } else {
            //     this.setState({errMsg: errMsg.error});
            // }
        }
    }
    render() {
        return (
            <div className="login-container">
                <div className="image3"></div>
                <div className="login-form">
                    {this.state.errMsg
                        ? <Alert showIcon type="error" message={this.state.errMsg.msg}/>
                        : null}
                    <Row>
                        <Col>
                            <Input size="large" value={this.state.userName} onChange={(e) => {
                                const value = e.target.value.trim();
                                this.setState({userName: value});
                                if (value && this.state.errMsg != null && (this.state.errMsg.title === 'nameEmpty' || this.state.errMsg.title === 'error')) {
                                    this.setState({errMsg: null});
                                }
                            }} prefix={<Icon type = "user" style = {{fontSize: 16}}/>} placeholder="用户名"/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Input size="large" type="password" value={this.state.password} onChange={(e) => {
                                const value = e.target.value.trim();
                                this.setState({password: value});
                                if (value && this.state.errMsg != null && (this.state.errMsg.title === 'passwordEmpty' || this.state.errMsg.title === 'error')) {
                                    this.setState({errMsg: null});
                                }
                            }} prefix={<Icon type = "lock" style = {{fontSize: 16}}/>} placeholder="密 码"/>
                        </Col>
                    </Row>
                    <Button size="large" type="primary" className="login-form-button" onClick={this.handledLogin}>
                        登 录
                    </Button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({user: state.login.user})

const mapDispatchToProps = (dispatch) => ({
    onLogin: (user) => {
        dispatch(login(user))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Login);
