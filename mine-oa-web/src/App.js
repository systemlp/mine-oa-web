import logo from './logo.svg';
import './App.css';
import './layout.css';
import 'antd/dist/antd.css'
import React, {Component} from 'react';
import {Layout, Menu, Icon, /*Breadcrumb,*/ Dropdown, Modal, Row, Col, Input, message} from 'antd';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { fetchUtil } from './utils/fetchUtil'

const {Header, Sider, Content, Footer} = Layout;
const {SubMenu} = Menu;
let menu;

class App extends Component {
    constructor(props) {
      super(props);
      this.state = {
        selectedKeys: [],
        openKeys: [],
        collapsed: false,
        modal: {},
        updatePwd: {},
        oldPwd:'',
        menuList: []
      }
      menu = (<Menu className="user-menu" onClick={(item, key, keyPath) => {
        switch (item.key) {
          case 'logout':
            sessionStorage.clear();
            browserHistory.push('/login');
            break;
          case 'updatePwd':
            this.renderUpdatePwd();
            break;
          default:
            this.setState({selectedKeys:[]});
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
      </Menu>);
    }
    toIndex = () => {
      this.setState({selectedKeys:[]});
      browserHistory.push("/");
    }
    componentWillMount(){
      if(!sessionStorage.getItem('token')){
        browserHistory.push('/login');
        return;
      }
      if(window.location.pathname !== '/') {
        const selectedKeys = [window.location.pathname];
        const subMenuKey = selectedKeys[0];
        const length = subMenuKey.indexOf('/', 1);
        const openKeys = [subMenuKey.substring(1, length === -1?subMenuKey.length:length)];
        this.setState({selectedKeys, openKeys});
      } else {
        this.setState({selectedKeys:[]});
      }
      this.fetchMenu();
    }
    fetchMenu() {
      fetchUtil({
        url: '/menu/findByToken',
        callBack: result => {
          const {code, msg} = result;
          if (code === 200) {
            const {data: menuList} = result;
            this.setState({menuList});
          } else {
            message.error(msg);
          }
        }
      });
    }
    componentDidMount() {}
    renderModal() {
      const {modal} = this.state;
      modal.onCancel = () => {
        this.setState({modal:{}});
      };
      if(!modal.okText){
        modal.okText = '确定';
      }
      if(!modal.cancelText){
        modal.cancelText = '取消';
      }
      const {type} = modal;
      switch (type) {
        case 'updatePwd':
          const {updatePwd} = this.state;
          let {oldPwd, newPwd, okPwd} = updatePwd;
          modal.content = <div>
            <Row type="flex" align="middle" className="marginB-10">
                <Col span={6} className="txt-right">
                  <label>原始密码</label>
                </Col>
                <Col span={12} offset={1}>
                  <Input type="password" value={oldPwd} onChange={(e) => {
                    updatePwd.oldPwd = e.target.value;
                    this.setState({updatePwd});
                  }}/>
                </Col>
            </Row>
            <Row type="flex" align="middle" className="marginB-10">
              <Col span={6} className="txt-right">
                <label>新 密 码</label>
              </Col>
              <Col span={12} offset={1}>
                <Input type="password" value={newPwd} onChange={(e) => {
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
                <Input type="password" value={okPwd} onChange={(e) => {
                  updatePwd.okPwd = e.target.value;
                  this.setState({updatePwd});
                }}/>
              </Col>
            </Row>
          </div>;
          break;
        default:
          modal.content = null;
      }
      return <Modal {...modal}>{modal.content}</Modal>
    }
    renderUpdatePwd() {
      const {updatePwd} = this.state;
      const modal =  {
        visible: true,
        title: '修改密码',
        okText: '修改',
        type: 'updatePwd',
        onOk: () => {
          if (!updatePwd.oldPwd) {
            message.warning('请输入原始密码！');
          } else if (!updatePwd.newPwd) {
            message.warning('请输入新密码！');
          } else if (!updatePwd.okPwd) {
            message.warning('请输入确认密码！');
          } else if (updatePwd.okPwd !== updatePwd.newPwd) {
            message.error('确认密码与新密码不一致！');
          }  else if (updatePwd.oldPwd === updatePwd.newPwd) {
            message.error('新密码不得与原始密码不一致！');
          } else {
            fetchUtil({
              url: '/user/updatePwd',
              method: 'POST',
              body: updatePwd,
              callBack: (result) => {
                if (result.code === 200) {
                    message.success(result.msg, 1, () => {
                      this.setState({modal:{}, updatePwd: {}});
                      sessionStorage.clear();
                      browserHistory.push('/login');
                    });
                } else {
                  message.error(result.msg);
                }
              }
            });
          }
        }
      };
      this.setState({modal});
    }
    renderMenu() {
      const {menuList} = this.state;
      return (
        <Menu
          ref="mainMenu"
          selectedKeys={this.state.selectedKeys}
          defaultOpenKeys={this.state.openKeys}
          theme="dark"
          mode="inline"
          collapsed={this.state.collapsed}
          className="layout-menu"
          onSelect={(item, key, selectedKeys) => {
            this.setState({
              selectedKeys: [item.key]
            });
            browserHistory.push(item.key);
        }}>
          {
            menuList.map(item => {
              return <SubMenu key={item.url} title={<span>{item.icon?<Icon type={item.icon} />:null}<span>{item.title}</span></span>}>
                {
                  item.children ?
                    item.children.map(child => {
                      return <Menu.Item key={child.url}>{child.title}</Menu.Item>
                    })
                    : null
                }
              </SubMenu>
            })
          }
        </Menu>
      );
    }
    render() {
      let {user} = this.props;
      if(!user || !user.id){
        user = JSON.parse(sessionStorage.getItem('user'));
      }
      user = user || {};
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
              {this.renderMenu()}
              {/* <Menu
                ref="mainMenu"
                selectedKeys={this.state.selectedKeys}
                defaultOpenKeys={this.state.openKeys}
                theme="dark"
                mode="inline"
                collapsed={this.state.collapsed}
                className="layout-menu"
                onSelect={(item, key, selectedKeys) => {
                  this.setState({
                    selectedKeys: [item.key]
                  });
                  browserHistory.push(item.key);
              }}>
                  <SubMenu key="org" title={<span><Icon type="team" /><span>组织架构</span></span>}>
                    <Menu.Item key="/org/dept">部门管理</Menu.Item>
                    <Menu.Item key="/org/position">职位管理</Menu.Item>
                    <Menu.Item key="/org/employee">员工管理</Menu.Item>
                    <Menu.Item key="/org/menu">菜单管理</Menu.Item>
                    <Menu.Item key="/org/role">角色管理</Menu.Item>
                    <Menu.Item key="/org/userRole">用户角色管理</Menu.Item>
                  </SubMenu>
                  <SubMenu key="echarts" title={<span><Icon type="github"/><span>Charts</span></span>}>
                    <Menu.Item key="/echarts">ECharts 图表</Menu.Item>
                  </SubMenu>
                  <SubMenu title={<span><Icon type="github"/><span>General</span></span>}>
                    <Menu.Item key="/button">Button 按钮</Menu.Item>
                    <Menu.Item key="/icon">Icon 图标</Menu.Item>
                  </SubMenu>
                  <SubMenu title={<span><Icon type="android"/><span>Grid</span></span>}>
                    <Menu.Item key="/grid">Grid 栅格</Menu.Item>
                    <Menu.Item key="/layout">Layout 布局</Menu.Item>
                  </SubMenu>
                  <SubMenu title={<span><Icon type="dingding"/><span>Navigation</span></span>}>
                    <Menu.Item key="/affix">Affix 固钉</Menu.Item>
                  </SubMenu>
                  <SubMenu title={<span><Icon type="aliwangwang"/><span>Data Entry</span></span>}>
                    <Menu.Item key="/cascader">Cascader 级联选择</Menu.Item>
                  </SubMenu>
              </Menu> */}
            </Sider>
            <Content>
              {/* <Breadcrumb style={{margin: 10}} separator=">>">
                  <Breadcrumb.Item>
                      <Icon type="home"/>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>
                      {this.state.selectedKeys.length<1?'':this.state.selectedKeys[0].substring(1)}
                  </Breadcrumb.Item>
              </Breadcrumb> */}
              <div id="layout-content" className="layout-content">{this.props.children}</div>
            </Content>
          </Layout>
          <Footer>footer</Footer>
          {this.renderModal()}
        </Layout>
      );
    }
}

const mapStateToProps = state => {
  return {
    user: state.setUser.user
  }
}

export default connect(mapStateToProps)(App);
