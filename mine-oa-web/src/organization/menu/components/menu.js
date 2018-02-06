import 'antd/dist/antd.css';
import './menu.css';
import React, {Component} from 'react';
import {Row, Col, Tree, Icon, Spin, Button, Tabs , Input, InputNumber ,Tooltip , Select, message} from 'antd';
import {fetchUtil} from '../../../utils/fetchUtil';

const TreeNode = Tree.TreeNode;
const TabPane = Tabs.TabPane;
const Option = Select.Option;

class Menu extends Component {
  state = {
    loadMenu: true,
    menuList: [],
    newMenu: {},
    editMenu: {},
    allMenuList: [],
    optionalMenuList: []
  };
  componentWillMount() {
    this.fetchMenu();
    this.fetchAllMenu();
  }
  fetchMenu() {
    fetchUtil({
      url: '/menu/findTree',
      callBack: result => {
        const {code, msg} = result;
        if (code === 200) {
          const {data: menuList} = result;
          this.setState({menuList, loadMenu:false});
        } else {
          message.error(msg);
        }
      }
    });
  }
  fetchAllMenu() {
    fetchUtil({
      url: '/menu/findAll',
      callBack: result => {
        const {code, msg} = result;
        if (code === 200) {
          const {data: allMenuList} = result;
          this.setState({allMenuList});
        } else {
          message.error(msg);
        }
      }
    });
  }
  loop(data) {
    return data.map( item => {
      let {url, title, icon, children} = item;
      if(icon) {
        title = (<span>
          <Icon type={item.icon} />
          <span>{title}</span>
        </span>);
      }
      if(children) {
        return (
          <TreeNode key={url} title={title}>
            {this.loop(children)}
          </TreeNode>
        );
      }
      return <TreeNode key={url} title={title} />;
    });
  }
  insert() {
    const {newMenu} = this.state;
    fetchUtil({
      url: '/menu/insert',
      method: 'post',
      body: newMenu,
      callBack: result => {
        const {code, msg} = result;
        switch (code) {
          case 200:
            message.success(msg);
            this.componentWillMount();
            this.setState({newMenu:{}});
            break;
          case 403:
            message.warn(msg);
            this.componentWillMount();
            break;
          default:
            message.error(msg);
        }
      }
    });
  }
  update() {
    const {editMenu} = this.state;
    fetchUtil({
      url: '/menu/update',
      method: 'post',
      body: editMenu,
      callBack: result => {
        const {code, msg} = result;
        switch (code) {
          case 200:
            message.success(msg);
            this.componentWillMount();
            this.setState({editMenu:{}});
            break;
          case 403:
            message.warn(msg);
            this.componentWillMount();
            break;
          default:
            message.error(msg);
        }
      }
    });
  }
  renderForm(data, type = 1) {
    const setMenu = (menu, type) => {
      switch (type) {
        case 1:
          this.setState({newMenu: menu})
          break;
        case 2:
          this.setState({editMenu: menu})
          break;
        default:
      }
    }
    const {allMenuList} = this.state;
    return (
      <div>
        <Row type="flex" align="middle" className="marginB-10">
          <Col span={3} className="txt-right">
            <label>父菜单</label>
          </Col>
          <Col className="marginL-10" span={10}>
            <Select className="width-per-100" value={data.parentId} onChange={(parentId) => {
              data.parentId = parentId;
              setMenu(data,type);
            }} placeholder="请选择" allowClear>
              {
                allMenuList.map((parent) => {
                  if (type === 2 && parent.id === data.id) {
                    return false;
                  }
                  const { id, title } = parent;
                  return <Option key={id} value={`${id}`}>{title}</Option>
                })
              }
            </Select>
          </Col>
        </Row>
        <Row type="flex" align="middle" className="marginB-10">
          <Col span={3} className="txt-right">
            <label>菜单名称</label>
          </Col>
          <Col className="marginL-10" span={10}>
            <Input value={data.title} maxLength="10" onChange={(e) => {
              data.title = e.target.value.trim();
              setMenu(data,type);
            }}/>
          </Col>
        </Row>
        <Row type="flex" align="middle" className="marginB-10">
          <Col span={3} className="txt-right">
            <label>链接路径</label>
          </Col>
          <Col className="marginL-10" span={10}>
            <Input value={data.url}
              maxLength="50"
              onChange={(e) => {
                data.url = e.target.value.trim();
                setMenu(data,type);
            }}/>
          </Col>
        </Row>
        <Row type="flex" align="middle" className="marginB-10">
          <Col span={3} className="txt-right">
            <label>显示顺序</label>
          </Col>
          <Col className="marginL-10" span={10}>
            <InputNumber value={data.sort} min={1} max={9999} onChange={(e) => {
              if(!e || !isNaN(e)) {
                data.sort = e;
                setMenu(data,type);
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
              <span>请至 <a href="http://design.alipay.com/develop/web/components/icon/" target="_blank" rel="noopener noreferrer">antd</a> 选择图标</span>
            }>
              <Input value={data.icon} maxLength="50" onChange={(e) => {
                data.icon = e.target.value.trim();
                setMenu(data,type);
              }}/>
            </Tooltip>
          </Col>
        </Row>
        <Row type="flex" align="middle">
          <Col span={6} className="txt-right">
            <Button type="primary" onClick={() => {
              if (type === 1) {
                this.insert();
              } else {
                this.update();
              }
            }}>确定</Button>
          </Col>
          <Col span={5} className="txt-center">
            <Button onClick={()=>setMenu({},type)}>重置</Button>
          </Col>
        </Row>
      </div>
    );
  }
  render() {
    const {loadMenu, menuList, newMenu, editMenu} = this.state;
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
                  {this.renderForm(newMenu)}
                </TabPane>
                <TabPane key="update" tab={<span><Icon type="edit" />编辑</span>}>
                  {this.renderForm(editMenu)}
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
