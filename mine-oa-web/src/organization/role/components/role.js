import 'antd/dist/antd.css';
import React, {Component} from 'react';
import {Table, Row, Col, message, Button, Input, Select, Popconfirm, Modal, Icon, Tree} from 'antd';
import {fetchUtil} from '../../../utils/fetchUtil';
import {EditableInput} from '../../../utils/components/editableInput';
import {defaultPagination} from '../../../constants/oaConstants';

const {Option} = Select;
const {TreeNode} = Tree;
const {Search} = Input;

class Role extends Component {
    state = {
        data: [],
        pagination: defaultPagination,
        loading: false,
        roleQuery: {
          pageSize: 5,
          current: 1
        },
        editRoleMap: new Map(),
        modal: {},
        insertRole: {},
        allMenuList: [],
        menuList: [],
        checkedKeys: new Set(),
        expandedKeys: [],
        autoExpandParent: true,
        searchValue: ''
    };
    columns = [
        {
            title: '角色编号',
            dataIndex: 'id',
            key: 'id',
            className: 'txt-center',
            width: '15%'
        }, {
            title: '角色名称',
            dataIndex: 'name',
            key: 'name',
            className: 'txt-center',
            width: '35%',
            render: (name, record, index) => {
              const {editRoleMap} = this.state;
              const editRole = editRoleMap.get(record.id);
              return (
                <EditableInput value={record.editable ? editRole.name : name} editable={record.editable} onChange={newName => {
                  editRole.name = newName;
                  editRoleMap.set(editRole.id, editRole);
                  this.setState({editRoleMap});
                }} />
              );
            }
        }, {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            className: 'txt-center',
            width: '15%',
            render: state => {
                return state === 1
                    ? '正常'
                    : '删除'
            }
        }, {
            title: '操作',
            dataIndex: 'id',
            key: 'operate',
            className: 'txt-center',
            render: (id, record, index) => {
              const {editable, state} = record;
              return <div>
                <a onClick={()=>this.renderMenuModel(id)}>菜单授权</a>&nbsp;&nbsp;&nbsp;&nbsp;
                {
                  editable ?
                  <span>
                    <a onClick = {() => this.update(index)}>保 存</a>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <a onClick = {() => this.cancelEdit(index)}>取 消</a>
                    {
                      state === 1 ?
                      <span>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Popconfirm title="确定删除吗?" onConfirm={() => this.delete(index)}>
                          <a>删 除</a>
                        </Popconfirm>
                      </span>
                      :
                      <span>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                          <a onClick={() => this.enable(index)}>启 用</a>
                      </span>
                    }
                  </span>
                  :
                  <span>
                    <a onClick = {() => this.edit(index)}>编 辑</a>
                    {
                      state === 1 ?
                      <span>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Popconfirm title="确定删除吗?" onConfirm={() => this.delete(index)}>
                          <a>删 除</a>
                        </Popconfirm>
                      </span>
                      :
                      <span>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                          <a onClick={() => this.enable(index)}>启 用</a>
                      </span>
                    }
                  </span>
                }
              </div>;
            }
        }
    ];
    componentWillMount() {
      this.fetchData();
      this.fetchMenuTree();
      this.fetchAllMenu();
    }
    fetchData() {
      this.setState({ loading: true });
      fetchUtil({
        url: '/role/findPageByParam',
        method: 'post',
        body: this.state.roleQuery,
        callBack: (result) => {
          const {code, msg} = result;
          if (code === 200) {
            const {data} = result;
            const {pagination} = this.state;
            pagination.total = data.total;
            this.setState({
              loading: false,
              data: data.list,
              pagination
            });
          } else {
            message.error(msg);
          }
        }
      });
    }
    fetchMenuTree() {
      fetchUtil({
        url: '/menu/findTree',
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
    fetchRoleMenu(id) {
      fetchUtil({
        url: `/role/${id}/findMenu`,
        callBack: result => {
          const {code, msg} = result;
          if (code === 200) {
            const {data} = result;
            const {menuIdSet, parentIdSet: expandedKeys} = data;
            this.setState({checkedKeys:new Set(menuIdSet), expandedKeys});
          } else {
            message.error(msg);
          }
        }
      });
    }
    handleTableChange = (pagination, filters, sorter) => {
      const {roleQuery} = this.state;
      roleQuery.current = pagination.current;
      roleQuery.pageSize = pagination.pageSize;
      this.setState({pagination, roleQuery});
      this.fetchData();
    }
    edit(index) {
      const {data, editRoleMap} = this.state;
      const curData = data[index];
      const editRole = {
        id: curData.id,
        name: curData.name
      };
      curData.editable = true;
      editRoleMap.set(editRole.id, editRole);
      this.setState({data, editRoleMap});
    }
    update(index) {
      const {data, editRoleMap} = this.state;
      const curData = data[index];
      const editRole = editRoleMap.get(curData.id);
      if (curData.name === editRole.name) {
        this.cancelEdit(index);
        return;
      }
      fetchUtil({
        url: '/role/update',
        method: 'post',
        body: editRole,
        callBack: result => {
          const {code, msg} = result;
          switch (code) {
            case 200:
              curData.editable = null;
              curData.name = editRole.name;
              editRoleMap.delete(curData.id);
              this.setState({data, editRole});
              message.info(msg);
              break;
            case 403:
              message.warn(msg);
              break;
            default:
              message.error(msg);
          }
        }
      });
    }
    delete(index) {
      const {data} = this.state;
      const curData = data[index];
      fetchUtil({
        url: `/role/${curData.id}/delete`,
        callBack: result => {
          const {code, msg} = result;
          switch (code) {
            case 200:
              message.info(msg);
              this.fetchFirstPage();
              break;
            case 403:
              message.warn(msg);
              break;
            default:
              message.error(msg);
          }
        }
      });
    }
    enable(index) {
      const {data} = this.state;
      const curData = data[index];
      fetchUtil({
        url: `/role/${curData.id}/enable`,
        callBack: result => {
          const {code, msg} = result;
          if (code === 200) {
            message.info(msg);
            this.fetchFirstPage();
            return;
          }
          message.error(msg);
        }
      });
    }
    cancelEdit(index) {
      const {data, editRoleMap} = this.state;
      data[index].editable = null;
      const curData = data[index];
      editRoleMap.delete(curData.id);
      this.setState({data, editRoleMap});
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
    getParentKey(menu, expandedKeys) {
      if (!menu.parentId) {
        return;
      }
      const {allMenuList} = this.state;
      for (let i = 0; i < allMenuList.length; i++) {
        const temp = allMenuList[i];
        if (temp.id === menu.parentId) {
          if (isNaN(expandedKeys.length)) {
            expandedKeys.add(`${temp.id}`);
          } else if (expandedKeys.indexOf(temp.id) < 0) {
            expandedKeys.push(`${temp.id}`);
          }
          if (temp.parentId) {
            this.getParentKey(temp, expandedKeys);
          }
        }
      }
    }
    getChildKey(menu, allMenuList, checkedKeys, checked) {
      allMenuList.forEach(item => {
        if (item.parentId === menu.id) {
          if (checked) {
            checkedKeys.add(`${item.id}`);
          } else {
            checkedKeys.delete(`${item.id}`);
          }
          this.getChildKey(item, allMenuList, checkedKeys, checked);
        }
      })
    }
    checkMenu(checkedKeys, e) {
      const {checked} = e;
      const {eventKey} = e.node.props;
      const {allMenuList} = this.state;
      const menu = allMenuList.find(item => item && `${item.id}` === eventKey);
      this.getParentKey(menu, checkedKeys);
      this.getChildKey(menu, allMenuList, checkedKeys, checked);
      this.setState({checkedKeys});
    }
    renderTree() {
      const {menuList, allMenuList, checkedKeys, expandedKeys, autoExpandParent} = this.state;
      return (
        <div className="menuManage">
          <div className="treeBox" style={{height: 300}}>
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
            checkable
            checkStrictly
            checkedKeys={[...checkedKeys]}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            onCheck={(keys, e) => this.checkMenu(new Set(keys), e)}
            onExpand={keys => {
              this.setState({
                expandedKeys: keys,
                autoExpandParent: false,
              });
            }}
            >
            {this.loop(menuList)}
            </Tree>
          </div>
        </div>
      );
    }
    renderModal() {
      const {modal} = this.state;
      modal.onCancel = () => {
        this.setState({modal:{}});
      };
      const {type} = modal;
      switch (type) {
        case 'insertRole':
          const {insertRole} = this.state;
          let {name} = insertRole;
          modal.content = <div>
            <Row type="flex" align="middle" className="marginB-10">
                <Col span={6} className="txt-right">
                  <label>角色名称</label>
                </Col>
                <Col span={12} offset={1}>
                  <Input value={name} onChange={(e) => {
                    name = e.target.value.trim();
                    insertRole.name = name;
                    this.setState({insertRole});
                  }}/>
                </Col>
            </Row>
          </div>;
          break;
        case 'menuAuthorize':
          modal.content = this.renderTree();
          break;
        default:
          modal.content = null;
      }
      return <Modal {...modal}>{modal.content}</Modal>
    }
    fetchFirstPage() {
      const {pagination} = this.state;
      pagination.current = 1;
      this.setState({pagination});
      this.fetchData();
    }
    renderInsert() {
      const {insertRole} = this.state;
      const modal =  {
        visible: true,
        title: '新增角色',
        type: 'insertRole',
        onOk: () => {
          if (!insertRole.name) {
            message.warning('请输入角色名称！');
            return;
          }
          fetchUtil({
            url: '/role/insert',
            method: 'POST',
            body: insertRole,
            callBack: (result) => {
              const {code, msg} = result;
              switch (code) {
                case 200:
                  message.success(msg);
                  this.setState({modal: {}, insertRole: {}});
                  this.fetchFirstPage();
                  break;
                case 403:
                  message.warn(msg);
                  break;
                default:
                  message.error(result.msg);
              }
            }
          });
        }
      };
      this.setState({modal});
    }
    renderMenuModel(id) {
      this.fetchRoleMenu(id);
      const modal =  {
        visible: true,
        title: '菜单授权',
        type: 'menuAuthorize',
        onOk: () => {
          fetchUtil({
            url: `/role/${id}/menuAuthorize`,
            method: 'POST',
            body: [...this.state.checkedKeys],
            callBack: (result) => {
              const {code, msg} = result;
              switch (code) {
                case 200:
                  message.success(msg);
                  this.setState({modal:{}});
                  break;
                case 403:
                  message.warn(msg);
                  break;
                default:
                  message.error(result.msg);
              }
            }
          });
        }
      };
      this.setState({modal});
    }
    render() {
      const {
        roleQuery,
      } = this.state;
      return (
        <div>
          <h2>角色管理</h2>
          <Row type="flex" align="middle" className="marginB-10">
              <Col span={2} className="txt-right">
                <label>角色名称</label>
              </Col>
              <Col className="marginL-10" span={5}>
                <Input value={roleQuery.name} onChange={(e) => {
                  roleQuery.name = e.target.value.trim();
                  this.setState({roleQuery});
                }}/>
              </Col>
              <Col span={2} offset={1} className="txt-right">
                <label>状 态</label>
              </Col>
              <Col className="marginL-10" span={5}>
                <Select className="width-per-100" value={roleQuery.state} onChange={(value) => {
                  roleQuery.state = value;
                  this.setState({roleQuery});
                }} placeholder="请选择" allowClear>
                  <Option value="1">正常</Option>
                  <Option value="0">删除</Option>
                </Select>
              </Col>
              <Col span={8} className="txt-right">
                <Button type="primary" className="marginR-10" loading={this.state.loading} onClick= {() => {
                  this.fetchFirstPage();
                }}>查询</Button>
                <Button onClick={() => this.renderInsert()}>新增</Button>
              </Col>
          </Row>
          <Table className="marginT-10" columns={this.columns}
            rowKey={record => record.id}
            dataSource={this.state.data}
            pagination={this.state.pagination}
            loading={this.state.loading}
            onChange={this.handleTableChange}
          />
          {this.renderModal()}
        </div>
      );
  }
}

export default Role;
