import 'antd/dist/antd.css';
import React, {Component} from 'react';
import {Table, Row, Col, message, Button, Input, Select, Popconfirm, Modal} from 'antd';
import {fetchUtil} from '../../../utils/fetchUtil';
import {EditableInput, EditableSelect} from '../../../utils/components/editableInput';
import {defaultPagination} from '../../../constants/oaConstants';

const Option = Select.Option;

class Dept extends Component {
    state = {
        data: [],
        pagination: defaultPagination,
        loading: false,
        deptQuery: {
          pageSize: 5,
          current: 1
        },
        editDeptMap: new Map(),
        parentDeptMap: new Map(),
        modal: {},
        insertDept: {},
        deptList: []
    };
    columns = [
        {
            title: '部门编号',
            dataIndex: 'id',
            key: 'id',
            className: 'txt-center',
            width: '15%'
        }, {
            title: '部门名称',
            dataIndex: 'name',
            key: 'name',
            className: 'txt-center',
            width: '25%',
            render: (name, record, index) => {
              const {editDeptMap} = this.state;
              const editDept = editDeptMap.get(record.id);
              return (
                <EditableInput value={record.editable ? editDept.name : name} editable={record.editable} onChange={newName => {
                  editDept.name = newName;
                  editDeptMap.set(editDept.id, editDept);
                  this.setState({editDeptMap});
                }} />
              );
            }
        }, {
            title: '父级部门',
            dataIndex: 'parentName',
            key: 'parentName',
            className: 'txt-center',
            width: '25%',
            render: (parentName, record, index) => {
              const {editDeptMap, parentDeptMap} = this.state;
              const editDept = editDeptMap.get(record.id);
              const parentDeptList = parentDeptMap.get(record.id);
              const data = {
                value: record.editable ? editDept.parentId : record.parentId,
                text: record.editable ? editDept.parentName : parentName
              };
              let dataSource = [];
              if(record.editable){
                parentDeptList.map(item => {
                  return dataSource.push({
                    value: item.id,
                    text: item.name
                  });
                });
              }
              return (
                <EditableSelect data={data} dataSource={dataSource} allowClear={true} editable={record.editable} onChange={result => {
                  if (result) {
                    editDept.parentId = result[0];
                    editDept.parentName = result[1];
                  } else {
                    editDept.parentId = undefined;
                    editDept.parentName = undefined;
                  }
                  editDeptMap.set(editDept.id, editDept);
                  this.setState({editDeptMap});
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
                {
                  editable ?
                  <span>
                    <a onClick = {() => this.save(index)}>保 存</a>
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
      fetchUtil({
        url: '/dept/findOptional',
        callBack: result => {
          const {code, msg} = result;
          if (code === 200) {
            const {data: deptList} = result;
            this.setState({deptList});
          } else {
            message.error(msg);
          }
        }
      });
    }
    fetchData() {
      this.setState({ loading: true });
      fetchUtil({
        url: '/dept/findPageByParam',
        method: 'post',
        body: this.state.deptQuery,
        callBack: (result) => {
          if (result.code === 200) {
            const {data} = result;
            const {pagination} = this.state;
            pagination.total = data.total;
            this.setState({
              loading: false,
              data: data.list,
              pagination
            });
          } else {
            message.error(result.msg);
          }
        }
      });
    }
    fetchFirstPage() {
      const {deptQuery} = this.state;
      deptQuery.current = 1;
      this.setState({deptQuery});
      this.fetchData();
    }
    handleTableChange = (pagination, filters, sorter) => {
      const {deptQuery} = this.state;
      deptQuery.current = pagination.current;
      deptQuery.pageSize = pagination.pageSize;
      this.setState({pagination, deptQuery});
      this.fetchData();
    }
    edit(index) {
      const {data, editDeptMap, parentDeptMap} = this.state;
      for (let item of data) {
        if(item.editable){
          message.warn('同时只允许编辑单个部门！');
          return;
        }
      }
      const curData = data[index];
      const editDept = {
        id: curData.id,
        name: curData.name,
        parentId: curData.parentId,
        parentName: curData.parentName
      };
      curData.editable = true;
      editDeptMap.set(editDept.id, editDept);
      fetchUtil({
        url: `/dept/findOptionalParent/${curData.id}`,
        callBack: result => {
          const {code, msg} = result;
          if (code === 200) {
            parentDeptMap.set(curData.id, result.data);
            this.setState({editDeptMap, data, parentDeptMap});
          } else {
            message.error(msg);
          }
        }
      });
    }
    save(index) {
      const {data, editDeptMap} = this.state;
      const curData = data[index];
      const editDept = editDeptMap.get(curData.id);
      if (curData.name === editDept.name && curData.parentId === editDept.parentId) {
        this.cancelEdit(index);
        return;
      }
      fetchUtil({
        url: '/dept/merge',
        method: 'post',
        body: editDept,
        callBack: result => {
          const {code, msg} = result;
          switch (code) {
            case 200:
              curData.editable = null;
              curData.name = editDept.name;
              curData.parentId = editDept.parentId;
              curData.parentName = editDept.parentName
              this.setState({data, editDeptMap: new Map()});
              message.info(msg);
              break;
            case 403:
              message.warn(msg);
              editDept.parentId = undefined;
              editDept.parentName = undefined;
              this.setState({editDeptMap});
              fetchUtil({
                url: `/dept/findOptionalParent/${curData.id}`,
                callBack: result => {
                  const {code, msg} = result;
                  if (code === 200) {
                    const {parentDeptMap} = this.state;
                    parentDeptMap.set(curData.id, result.data);
                    this.setState({parentDeptMap});
                  } else {
                    message.error(msg);
                  }
                }
              });
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
        url: `/dept/delete/${curData.id}`,
        callBack: result => {
          const {code, msg} = result;
          if (code === 200) {
            message.info(msg);
            this.fetchFirstPage();
            return;
          }
          if (code === 403) {
            message.warn(msg);
            return;
          }
          message.error(msg);
        }
      });
    }
    enable(index) {
      const {data} = this.state;
      const curData = data[index];
      fetchUtil({
        url: `/dept/enable/${curData.id}`,
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
      const {data, editDeptMap} = this.state;
      data[index].editable = null;
      const curData = data[index];
      editDeptMap.delete(curData.id);
      this.setState({data, editDeptMap});
    }
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
        case 'insertDept':
          const {insertDept, deptList} = this.state;
          let {name, parentId} = insertDept;
          modal.content = <div>
            <Row type="flex" align="middle" className="marginB-10">
                <Col span={6} className="txt-right">
                  <label>部门名称</label>
                </Col>
                <Col span={12} offset={1}>
                  <Input value={name} onChange={(e) => {
                    name = e.target.value.trim();
                    insertDept.name = name;
                    this.setState({insertDept});
                  }}/>
                </Col>
            </Row>
            <Row type="flex" align="middle" className="marginB-10">
              <Col span={6} className="txt-right">
                <label>父级部门</label>
              </Col>
              <Col span={12} offset={1}>
              <Select className="width-per-100" value={parentId} onChange={(parentId) => {
                insertDept.parentId = parentId;
                this.setState({insertDept});
              }} placeholder="请选择" allowClear>
                {
                  deptList.map((deptItem) => {
                    const {
                      id,
                      name
                    } = deptItem;
                    return <Option key={id} value={`${id}`}>{name}</Option>
                  })
                }
              </Select>
              </Col>
            </Row>
          </div>;
          break;
        default:
          modal.content = null;
      }
      return <Modal {...modal}>{modal.content}</Modal>
    }
    renderInsert() {
      const {insertDept} = this.state;
      const modal =  {
        visible: true,
        title: '新增部门',
        type: 'insertDept',
        onOk: () => {
          if (!insertDept.name) {
            message.warning('请输入部门名称！');
            return;
          }
          fetchUtil({
            url: '/dept/insert',
            method: 'POST',
            body: insertDept,
            callBack: (result) => {
              const {code, msg} = result;
              switch (code) {
                case 200:
                  message.success(msg);
                  this.setState({modal: {}, insertDept: {}});
                  this.fetchFirstPage();
                  break;
                case 403:
                  message.warn(msg);
                  fetchUtil({
                    url: '/dept/findOptional',
                    callBack: result => {
                      const {code, msg} = result;
                      if (code === 200) {
                        const {data: deptList} = result;
                        this.setState({deptList});
                      } else {
                        message.error(msg);
                      }
                    }
                  });
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
      const {deptQuery} = this.state;
      return (
        <div>
          <h2>部门管理</h2>
          <Row type="flex" align="middle" className="marginB-10">
              <Col span={2} className="txt-right">
                <label>部门名称</label>
              </Col>
              <Col className="marginL-10" span={5}>
                <Input value={deptQuery.name} onChange={(e) => {
                  deptQuery.name = e.target.value.trim();
                  this.setState({deptQuery});
                }}/>
              </Col>
              <Col span={2} offset={1} className="txt-right">
                <label>父级部门</label>
              </Col>
              <Col className="marginL-10" span={5}>
                <Input value={deptQuery.parentName} onChange={(e) => {
                  deptQuery.parentName = e.target.value.trim();
                  this.setState({deptQuery});
                }}/>
              </Col><Col span={2} offset={1} className="txt-right">
                <label>状 态</label>
              </Col>
              <Col className="marginL-10" span={5}>
                <Select className="width-per-100" value={deptQuery.state} onChange={(value) => {
                  deptQuery.state = value;
                  this.setState({deptQuery});
                }} placeholder="请选择" allowClear>
                  <Option value="1">正常</Option>
                  <Option value="0">删除</Option>
                </Select>
              </Col>
          </Row>
          <Row type="flex" justify="end" className="marginB-10">
            <Col span={4} className="txt-center">
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

export default Dept;
