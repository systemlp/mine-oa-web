import logo from './logo.svg';
import './App.css';
import './layout.css';
import 'antd/dist/antd.css'
import React, {Component} from 'react';
import {Layout, Menu, Icon, Breadcrumb, Dropdown, Modal, Row, Col, Input, message} from 'antd';
import {browserHistory} from 'react-router';
import { connect } from 'react-redux';

const {Header, Sider, Content, Footer} = Layout;
const {SubMenu} = Menu;

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedKeys: [],
            collapsed: false,
            modal: {},
            updatePwd: {},
            oldPwd:''
        }
    }
    toIndex = () => {
        this.setState({selectedKeys: []});
        browserHistory.push("/");
    }
    componentWillMount(){
      if(!sessionStorage.getItem('token')){
        browserHistory.push('/login');
        return;
      }
    }
    componentDidMount() {}
    renderModal() {
      const {modal} = this.state;
      return <Modal {...modal}>{modal.content}</Modal>
    }
    cancelModal() {
      this.setState({modal:{}});
    }
    renderUpdatePwd() {
      const {updatePwd} = this.state;
      const content = <div>
        <Row type="flex" align="middle" className="marginB-10">
            <Col span={6} className="txt-right">
              <label>原始密码</label>
            </Col>
            <Col span={12} offset={1}>
              <Input type="password" onChange={(e) => {
                updatePwd.oldPwd = e.target.value;
                this.setState({updatePwd});
              }}/>
            </Col>
        </Row>
        <Row type="flex" align="middle" className="marginB-10">
          <Col span={6} className="txt-right">
            <label>新密码</label>
          </Col>
          <Col span={12} offset={1}>
            <Input type="password" onChange={(e) => {
              updatePwd.newPwd = e.target.value;
              this.setState({updatePwd});
            }}/>
          </Col>
        </Row>
        <Row type="flex" align="middle" className="marginB-10">
          <Col span={6} className="txt-right">
            <label>确认密码</label>
          </Col>
          <Col span={12} offset={1}>
            <Input type="password" onChange={(e) => {
              updatePwd.okPwd = e.target.value;
              this.setState({updatePwd});
            }}/>
          </Col>
        </Row>
      </div>;
      const modal =  {
        visible: true,
        title: '修改密码',
        okText: '修改',
        cancelText: '取消',
        content,
        onCancel: () => {
          this.cancelModal();
        },
        onOk: () => {
          if (!updatePwd.oldPwd) {
            message.warning('请输入原始密码！');
          } else if (!updatePwd.newPwd) {
            message.warning('请输入新密码！');
          } else if (!updatePwd.okPwd) {
            message.warning('请输入确认密码！');
          } else if (updatePwd.okPwd !== updatePwd.newPwd) {
            message.error('确认密码与新密码不一致！');
          } else {

          }
        }
      };
      this.setState({modal});
    }
    render() {
        // const {user} = this.props;
        let user = JSON.parse(sessionStorage.getItem('user'));
        user = user || {};
        const menu = (
          <Menu className="user-menu" onClick={(item, key, keyPath) => {
            switch (item.key) {
              case 'logout':
                sessionStorage.clear();
                browserHistory.push('/login');
                break;
              case 'updatePwd':
                this.renderUpdatePwd();
                break;
              default:
                browserHistory.push(item.key);
            }
          }}>
            <Menu.Item key="/userData">
              <Icon type="user" />个人资料
            </Menu.Item>
            <Menu.Item key="updatePwd">
              <Icon type="lock" />修改密码
            </Menu.Item>
            <Menu.Item key="logout">
              <Icon type="logout" />退出
            </Menu.Item>
          </Menu>
        );
        return (
            <Layout>
                <Header className="layout-header">
                    <div className="app-header">
                        <span style={{
                            cursor: 'pointer'
                        }} onClick={this.toIndex} title="首页">
                            <img src={logo} className="app-logo" alt="logo"/>
                            <span className="app-welcome">欢迎使用React</span>
                        </span>
                        <div className="user">
                          <Dropdown overlay={menu}>
                            <span className="ant-dropdown-link" href="#">
                              <img className="userImg" src={user.photoUrl} alt=""/>
                              <Icon type="caret-down" />
                            </span>
                          </Dropdown>
                        </div>
                    </div>
                </Header>
                <Layout>
                    <Sider trigger={null} className="layout-sider" collapsible collapsed={this.state.collapsed}>
                        <Icon style={{
                            color: '#fff',
                            fontSize: 20,
                            margin: '10px 0 20px 22px'
                        }} type={this.state.collapsed
                            ? 'menu-unfold'
                            : 'menu-fold'} onClick={() => {
                            this.setState({
                                collapsed: !this.state.collapsed
                            })
                        }}/>
                        <Menu ref="mainMenu" selectedKeys={this.state.selectedKeys} theme="dark" mode="inline" collapsed={this.state.collapsed} className="layout-menu" onSelect={(item, key, selectedKeys) => {
                            this.setState({
                                selectedKeys: [item.key]
                            });
                            browserHistory.push(item.key);
                        }}>
                            <SubMenu title={<span> <Icon type="github"/> <span> Charts </span></span>}>
                                <Menu.Item key="/echarts">ECharts 图表</Menu.Item>
                            </SubMenu>
                            <SubMenu title={<span> <Icon type="github"/> <span> General </span></span>}>
                                <Menu.Item key="/button">Button 按钮</Menu.Item>
                                <Menu.Item key="/icon">Icon 图标</Menu.Item>
                            </SubMenu>
                            <SubMenu title={<span> <Icon type="android"/> <span> Grid </span></span>}>
                                <Menu.Item key="/grid">Grid 栅格</Menu.Item>
                                <Menu.Item key="/layout">Layout 布局</Menu.Item>
                            </SubMenu>
                            <SubMenu title={<span> <Icon type="dingding"/> <span> Navigation </span></span>}>
                                <Menu.Item key="/affix">Affix 固钉</Menu.Item>
                            </SubMenu>
                            <SubMenu title={<span> <Icon type="aliwangwang"/> <span> Data Entry </span></span>}>
                                <Menu.Item key="/cascader">Cascader 级联选择</Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Sider>
                    <Content>
                        <Breadcrumb style={{margin: 10}} separator=">>">
                            <Breadcrumb.Item>
                                <Icon type="home"/>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                {this.state.selectedKeys.length<1?'':this.state.selectedKeys[0].substring(1)}
                            </Breadcrumb.Item>
                        </Breadcrumb>
                        <div id="layout-content" className="layout-content">{this.props.children}</div>
                    </Content>
                </Layout>
                <Footer>footer</Footer>
                {this.renderModal()}
            </Layout>
        // <div className="App">
        //     <div className="App-header">
        //         <img src={logo} className="App-logo" alt="logo"/>
        //         <h2>欢迎使用React</h2>
        //     </div>
        //     <Button type="primary">cfjnd</Button>
        //     <p className="App-intro">
        //         To get started, edit
        //         <code>src/App.js</code>
        //         and save to reload.
        //     </p>
        //     <ul>
        //         <li onClick={() => {
        //             browserHistory.push("/hello")
        //         }}>xnolre</li>
        //     </ul>
        //     {this.props.children}
        // </div>
        );
    }
}

const mapStateToProps = state => {
  return {
    user: state.login.user
  }
}

export default connect(mapStateToProps)(App);
