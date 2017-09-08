import logo from './logo.svg';
import './App.css';
import './layout.css';
import 'antd/dist/antd.css'
import React, {Component} from 'react';
import {Layout, Menu, Icon, Breadcrumb} from 'antd';
import {browserHistory} from 'react-router';
import { connect } from 'react-redux';

const {Header, Sider, Content, Footer} = Layout;
const {SubMenu} = Menu;

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedKeys: [],
            collapsed: false
        }
    }
    toIndex = () => {
        this.setState({selectedKeys: []});
        browserHistory.push("/");
    }
    componentWillMount(){
      const {user} = this.props;
      if(!user || !user.userName){
        browserHistory.push('/login');
      }
    }
    componentDidMount() {}
    render() {
        const {user} = this.props;
        return (
            <Layout>
                <Header className="layout-header">
                    <div className="app-header">
                        <span style={{
                            cursor: 'pointer'
                        }} onClick={this.toIndex} title="首页">
                            <img src={logo} className="app-logo" alt="logo"/>
                            <span className="app-welcome">欢迎使用React {user.userName}</span>
                        </span>
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
                            <SubMenu title={< span > <Icon type="github"/> < span > Charts < /span></span >}>
                                <Menu.Item key="/echarts">ECharts 图表</Menu.Item>
                            </SubMenu>
                            <SubMenu title={< span > <Icon type="github"/> < span > General < /span></span >}>
                                <Menu.Item key="/button">Button 按钮</Menu.Item>
                                <Menu.Item key="/icon">Icon 图标</Menu.Item>
                            </SubMenu>
                            <SubMenu title={< span > <Icon type="android"/> < span > Grid < /span></span >}>
                                <Menu.Item key="/grid">Grid 栅格</Menu.Item>
                                <Menu.Item key="/layout">Layout 布局</Menu.Item>
                            </SubMenu>
                            <SubMenu title={< span > <Icon type="dingding"/> < span > Navigation < /span></span >}>
                                <Menu.Item key="/affix">Affix 固钉</Menu.Item>
                            </SubMenu>
                            <SubMenu title={< span > <Icon type="aliwangwang"/> < span > Data Entry < /span></span >}>
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
