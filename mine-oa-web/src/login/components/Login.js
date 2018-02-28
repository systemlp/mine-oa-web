import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';
import {fetchUtil} from '../../utils/fetchUtil';
import {
    Row,
    Col,
    Icon,
    Input,
    Button,
    Alert
} from 'antd';
import './login.css';
import {setUser} from '../../user/redux/actions/setUser';

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
        loading: false
        // user: {},
      }
    }
    handledLogin = () => {
      const {userName, password} = this.state;
      const {setUser} = this.props;
      if (!userName) {
        this.setState({errMsg: errMsg.nameEmpty});
      } else if (!password) {
        this.setState({errMsg: errMsg.passwordEmpty});
      } else {
        this.setState({loading: true});
        fetchUtil({
          url: '/user/login',
          method: 'post',
          body: {
            userName,
            password
          },
          callBack: (result) => {
            if (result.code === 200) {
              const {token} = result.data;
              sessionStorage.setItem('token', token);
              fetchUtil({
                url: '/user/getUserByToken',
                callBack: (result) => {
                  const {code, data: user} = result;
                  if (code === 200) {
                    // 将用户信息存在redux（页面刷新后会丢失）和浏览器缓存中
                    setUser(user);
                    sessionStorage.setItem('user', JSON.stringify(user));
                    this.setState({loading: false});
                    browserHistory.push('/');
                  }
                }
              });
            } else {
              this.setState({
                errMsg: {
                  title: 'error',
                  msg: result.msg
                }
              });
              this.setState({loading: false});
            }
          }
        });
      }
    }
    render() {
      const {loading} = this.state;
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
                            <Input onPressEnter={() => this.handledLogin()} size="large" type="password" value={this.state.password} onChange={(e) => {
                                const value = e.target.value.trim();
                                this.setState({password: value});
                                if (value && this.state.errMsg != null && (this.state.errMsg.title === 'passwordEmpty' || this.state.errMsg.title === 'error')) {
                                    this.setState({errMsg: null});
                                }
                            }} prefix={<Icon type = "lock" style = {{fontSize: 16}}/>} placeholder="密 码"/>
                        </Col>
                    </Row>
                    <Button size="large" type="primary" className="login-form-button" loading={loading} onClick={this.handledLogin}>
                        登 录
                    </Button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({user: state.setUser.user})

const mapDispatchToProps = (dispatch) => ({
    setUser: user => dispatch(setUser(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(Login);
