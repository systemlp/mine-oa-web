import 'antd/dist/antd.css';
import './menu.css';
import React, {Component} from 'react';
import {Row, Col, Tree, Icon, Spin, Button, Tabs , Input, InputNumber ,Tooltip , Select, message, Popconfirm} from 'antd';
import {fetchUtil} from '../../../utils/fetchUtil';

const TreeNode = Tree.TreeNode;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const Search = Input.Search;

class Menu extends Component {
  state = {
    loadMenu: true,
    menuList: [],
    newMenu: {},
    editMenu: {},
    allMenuList: [],
    optionalMenuList: [],
    selectedKeys: [],
    expandedKeys: [],
    autoExpandParent: true,
    searchValue: ''
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
  fetchOptionalParent(selectedKeys) {
    if (!selectedKeys || !selectedKeys.length) {
      this.setState({optionalMenuList: []});
      return;
    }
    fetchUtil({
      url: `/menu/${selectedKeys[0]}/findOptionalParent`,
      callBack: result => {
        const {code, msg} = result;
        if (code === 200) {
          const {data: optionalMenuList} = result;
          this.setState({optionalMenuList});
        } else {
          message.error(msg);
        }
      }
    });
  }
  loop(data) {
    const {searchValue} = this.state;
    return data.map( item => {
      let {id, title, icon, children} = item;
      const index = title.indexOf(searchValue);
      const beforeStr = title.substr(0, index);
      const afterStr = title.substr(index + searchValue.length);
      title = index > -1 ? (
        <span>
          {beforeStr}
          <span style={{ color: '#f50' }}>{searchValue}</span>
          {afterStr}
        </span>
      ) : <span>{title}</span>;
      if(icon) {
        title = (<span>
          <Icon type={item.icon} />
          {title}
        </span>);
      }
      if(children) {
        return (
          <TreeNode key={`${id}`} title={title}>
            {this.loop(children)}
          </TreeNode>
        );
      }
      return <TreeNode key={`${id}`} title={title} />;
    });
  }
  insert() {
    const {newMenu} = this.state;
    const {title, url, sort} = newMenu;
    if (!title || !url || !sort) {
      message.warn('必填项未填写');
      return;
    }
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
  delete() {
    const {editMenu, allMenuList} = this.state;
    const {id} = editMenu;
    if (!id) {
      message.warn('请选择需要删除的菜单');
      return;
    }
    if (allMenuList.find(item=>item&&item.parentId===id)) {
      message.warn('该菜单下存在子菜单，无法删除');
      return;
    }
    fetchUtil({
      url: `/menu/${id}/delete`,
      callBack: result => {
        const {code, msg} = result;
        switch (code) {
          case 200:
            message.success(msg);
            this.componentWillMount();
            this.setState({editMenu:{}, selectedKeys: []});
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
    const {id, title, url, sort} = editMenu;
    if (!id) {
      message.warn('请选择需要编辑的菜单');
      return;
    }
    if (!title || !url || !sort) {
      message.warn('必填项未填写');
      return;
    }
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
            this.setState({editMenu:{}, selectedKeys: []});
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
          this.setState({editMenu: menu, selectedKeys: []})
          break;
        default:
      }
    }
    const {allMenuList, optionalMenuList} = this.state;
    const menuList = type === 1 ? allMenuList : optionalMenuList;
    return (
      <div>
        <Row type="flex" align="middle" className="marginB-10">
          <Col span={3} className="txt-right">
            <label>父菜单</label>
          </Col>
          <Col className="marginL-10" span={10}>
            <Select className="width-per-100" value={`${data.parentId?data.parentId:''}`} onChange={(parentId) => {
              data.parentId = parentId;
              setMenu(data,type);
            }} placeholder="请选择" allowClear>
              {
                menuList.map((parent) => {
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
            <label className="ant-form-item-required">菜单名称</label>
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
            <label className="ant-form-item-required">链接路径</label>
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
            <label className="ant-form-item-required">显示顺序</label>
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
  getParentKey(menu, expandedKeys) {
    const {menuList} = this.state;
    for (let i = 0; i < menuList.length; i++) {
      const temp = menuList[i];
      if (temp.id === menu.parentId) {
        if (expandedKeys.indexOf(temp.url) < 0) {
          expandedKeys.push(`${temp.id}`);
        }
        if (temp.parentId) {
          this.getParentKey(temp, expandedKeys);
        }
      }
    }
  }
  renderTree() {
    const {menuList, expandedKeys, allMenuList, autoExpandParent, selectedKeys} = this.state;
    return (
      <div>
        <Search style={{ width: 260 }}
          placeholder="搜索"
          onChange={e => {
          const searchValue = e.target.value.trim();
          this.setState({searchValue});
          if (!searchValue || !allMenuList || allMenuList.length < 1) {
            return;
          }
          const menus = allMenuList.filter(item => {
            return item && item.title.indexOf(searchValue) > -1
          });
          const expandedKeys = [];
          menus.map(menu => this.getParentKey(menu,expandedKeys));
          this.setState({expandedKeys, autoExpandParent: true});
        }}/>
        <Tree
          selectedKeys={selectedKeys}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onExpand={keys => {
            this.setState({
              expandedKeys: keys,
              autoExpandParent: false,
            });
          }}
          onSelect={ selectedKeys => {
            this.setState({selectedKeys});
            this.fetchOptionalParent(selectedKeys);
            if (!selectedKeys.length) {
              this.setState({editMenu: {}});
              return;
            }
            const editMenu = allMenuList.find(item => item && `${item.id}` === selectedKeys[0]);
            this.setState({editMenu});
          }}
        >
          {this.loop(menuList)}
        </Tree>
      </div>
    );
  }
  renderDelete() {
    const {editMenu, allMenuList} = this.state;
    const {id} = editMenu;
    if (!id || allMenuList.find(item=>item&&item.parentId===id)) {
      return (
        <Button type="danger" onClick={() => this.delete()}>删除</Button>
      );
    }
    return (
      <Popconfirm
        title={<span>确定删除 <span style={{ color: '#f50' }}>{editMenu.title}</span> 菜单吗？</span>}
        placement="bottomRight"
        onConfirm={() => this.delete()}>
        <Button type="danger">删除</Button>
      </Popconfirm>
    );
  }
  render() {
    const {loadMenu, newMenu, editMenu} = this.state;
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
                  this.renderTree()
              }
            </div>
          </Col>
          <Col span={11}>
            <div className="operateBox">
              <Tabs tabBarExtraContent={this.renderDelete()}>
                <TabPane key="create" tab={<span><Icon type="plus-square-o" />新增</span>}>
                  {this.renderForm(newMenu)}
                </TabPane>
                <TabPane key="update" tab={<span><Icon type="edit" />编辑</span>}>
                  {this.renderForm(editMenu, 2)}
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
