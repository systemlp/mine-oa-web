import 'antd/dist/antd.css';
import './menu.css';
import React, {Component} from 'react';
import {Row, Col, Tree, Icon, Spin, Button, Tabs , Input, InputNumber ,Tooltip } from 'antd';

const TreeNode = Tree.TreeNode;
const TabPane = Tabs.TabPane;

class Menu extends Component {
  state = {
    loadMenu: true,
    menuList:[],
    newMenu: {parentName:'123'},
    editMenu: {}
  };
  componentWillMount() {
    this.fetchMenu();
  }
  fetchMenu() {
    setTimeout(() => {
      this.setState({menuList:[{key:'1',title:'1'}], loadMenu:false});

    }, 2000)
  }
  loop(data) {
    return data.map( item => {
      if(item.icon) {
        item.title = (<span>
          <Icon type={item.icon} />
          <span>{item.title}</span>
        </span>);
      }
      if(item.children) {
        return (
          <TreeNode {...item}>
            {this.loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key="1" title="1" />;
    });
  }
  activeKey(activeKey) {
    this.setState({activeKey});
  }
  render() {
    const {loadMenu, menuList, activeKey, newMenu} = this.state;
    return (
      <div className='menuManage'>
        <h2>菜单管理</h2>
        <Row type="flex" justify="space-around" className="marginT-10 marginB-10">
          <Col span={11}>
            <div className='treeBox'>
              {
                loadMenu?
                  <div className='spinCont'>
                    <Spin size="large" />
                  </div>
                :
                  <Tree>
                    {this.loop(menuList)}
                  </Tree>
              }
            </div>
          </Col>
          <Col span={11}>
            <div className="operateBox">
              <Tabs tabBarExtraContent={
                <Button type="danger">删除</Button>
              }>
                <TabPane key="create" tab={<span><Icon type="plus-square-o" />新增</span>}>
                  <Row type="flex" align="middle" className="marginB-10">
                    <Col span={3} className="txt-right">
                      <label>父菜单</label>
                    </Col>
                    <Col className="marginL-10" span={10}>
                      <Input disabled value={newMenu.parentName}
                        suffix={newMenu.parentName ? <Icon type="close-circle" onClick={() => {
                          newMenu.parentId = null;
                          newMenu.parentName = null;
                          this.setState({newMenu});
                        }} /> : null
                      }/>
                    </Col>
                  </Row>
                  <Row type="flex" align="middle" className="marginB-10">
                    <Col span={3} className="txt-right">
                      <label>菜单名称</label>
                    </Col>
                    <Col className="marginL-10" span={10}>
                      <Input value={newMenu.name} maxLength="10" onChange={(e) => {
                        newMenu.name = e.target.value.trim();
                        this.setState({newMenu});
                      }}/>
                    </Col>
                  </Row>
                  <Row type="flex" align="middle" className="marginB-10">
                    <Col span={3} className="txt-right">
                      <label>链接路径</label>
                    </Col>
                    <Col className="marginL-10" span={10}>
                      <Input value={newMenu.url}
                        maxLength="50"
                        onChange={(e) => {
                          newMenu.url = e.target.value.trim();
                          this.setState({newMenu});
                      }}/>
                    </Col>
                  </Row>
                  <Row type="flex" align="middle" className="marginB-10">
                    <Col span={3} className="txt-right">
                      <label>显示顺序</label>
                    </Col>
                    <Col className="marginL-10" span={10}>
                      <InputNumber value={newMenu.order} min={1} max={9999} onChange={(e) => {
                        if(!e || !isNaN(e)) {
                          newMenu.order = e;
                          this.setState({newMenu});
                        }
                      }}/>
                    </Col>
                  </Row>
                  <Row type="flex" align="middle" className="marginB-10">
                    <Col span={3} className="txt-right">
                      <label>图标</label>
                    </Col>
                    <Col className="marginL-10" span={10}>
                      <Tooltip placement="topRight" title={
                        <span>请至 <a href="http://design.alipay.com/develop/web/components/tooltip/" target="_blank" rel="noopener noreferrer">antd</a> 选择图标</span>
                      }>
                        <Input value={newMenu.icon} maxLength="50" onChange={(e) => {
                          newMenu.icon = e.target.value.trim();
                          this.setState({newMenu});
                        }}/>
                      </Tooltip>
                    </Col>
                  </Row>
                  <Row type="flex" align="middle">
                    <Col span={5} className="txt-right">
                      <Button type="primary">新增</Button>
                    </Col>
                    <Col span={5} className="txt-right">
                      <Button onClick={()=>this.setState({newMenu:{}})}>重置</Button>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane key="update" tab={<span><Icon type="edit" />编辑</span>}>

                </TabPane>
              </Tabs>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
 export default Menu;
