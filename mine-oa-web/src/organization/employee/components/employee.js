import 'antd/dist/antd.css';
import React, {Component} from 'react';
import {Table, Row, Col, message, Button, Input, Select, Popconfirm, Modal} from 'antd';
import {fetchUtil} from '../../../utils/fetchUtil';
import {defaultPagination} from '../../../constants/oaConstants';

const Option = Select.Option;

class Employee extends Component {
    state = {
        data: [],
        pagination: defaultPagination,
        loading: false,
        empQuery: {
          pageSize: 5,
          current: 1
        },
        editDeptMap: new Map(),
        parentDeptMap: new Map(),
        modal: {},
        insertDept: {},
        deptList: [],
        posiList: []
    };
    columns = [
        {
            title: '员工编号',
            dataIndex: 'id',
            key: 'id',
            className: 'txt-center',
            width: '8%'
        }, {
            title: '账号',
            dataIndex: 'userName',
            key: 'userName',
            className: 'txt-center',
            width: '10%'
        }, {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
            className: 'txt-center',
            width: '12%'
        }, {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            className: 'txt-center',
            width: '10%'
        }, {
            title: '性别',
            dataIndex: 'sex',
            key: 'sex',
            className: 'txt-center',
            width: '5%',
            render: (sex, record, index) => {
              switch (sex) {
                case 0:
                  return '女';
                case 1:
                  return '男';
                default:
                  return '未知';
              }
            }
        }, {
            title: '手机号',
            dataIndex: 'mobile',
            key: 'mobile',
            className: 'txt-center',
            width: '12%'
        }, {
            title: '部门',
            dataIndex: 'positionName',
            key: 'positionName',
            className: 'txt-center',
            width: '10%'
        }, {
            title: '职位',
            dataIndex: 'deptName',
            key: 'deptName',
            className: 'txt-center',
            width: '10%'
        }, {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            className: 'txt-center',
            width: '5%',
            render: (state, record, index) => {
              return state === 1 ? '正常' : '离职';
            }
        }, {
            title: '操作',
            dataIndex: 'id',
            key: 'operate',
            className: 'txt-center',
            render: (id, record, index) => {
              const {state} = record;
              return <div>
                {
                  state === 1 ?
                  <span>
                    <a onClick = {() => this.edit(index)}>编 辑</a>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Popconfirm title="确定离职吗?" onConfirm={() => this.delete(index)}>
                      <a>离 职</a>
                    </Popconfirm>
                  </span>
                  :
                  <span>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                      <a onClick={() => this.enable(index)}>恢 复</a>
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
      this.fetchPosiList();
    }
    fetchData() {
      this.setState({ loading: true });
      fetchUtil({
        url: '/employee/findPageByParam',
        method: 'post',
        body: this.state.empQuery,
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
    fetchPosiList(deptId) {
      fetchUtil({
        url: '/position/findPageByParam',
        method: 'post',
        body: {pageSize: 0, state:1, deptId},
        callBack: result => {
          const {code, msg, data} = result;
          if (code === 200) {
            const {list: posiList} = data;
            this.setState({posiList});
          } else {
            message.error(msg);
          }
        }
      });
    }
    handleTableChange = (pagination, filters, sorter) => {
      const {empQuery} = this.state;
      empQuery.current = pagination.current;
      empQuery.pageSize = pagination.pageSize;
      this.setState({pagination, empQuery});
      this.fetchData();
    }
    edit(index) {
      alert('打开编辑窗口');
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
            curData.state = 0;
            this.setState({data});
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
            curData.state = 1;
            this.setState({data});
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
                  const {pagination} = this.state;
                  pagination.current = 1;
                  this.setState({pagination, modal: {}, insertDept: {}});
                  this.fetchData();
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
      const { empQuery, deptList, posiList } = this.state;
      const { userName, name, mobile, deptId, positionId } = empQuery;
      return (
        <div>
          <h2>员工管理</h2>
          <Row type="flex" align="middle" className="marginB-10">
              <Col span={2} className="txt-right">
                <label>用户名</label>
              </Col>
              <Col className="marginL-10" span={5}>
                <Input value={userName} onChange={(e) => {
                  empQuery.userName = e.target.value.trim();
                  this.setState({empQuery});
                }}/>
              </Col>
              <Col span={2} offset={1} className="txt-right">
                <label>姓 名</label>
              </Col>
              <Col className="marginL-10" span={5}>
                <Input value={name} onChange={(e) => {
                  empQuery.name = e.target.value.trim();
                  this.setState({empQuery});
                }}/>
              </Col>
              <Col span={2} offset={1} className="txt-right">
                <label>手机号</label>
              </Col>
              <Col className="marginL-10" span={5}>
                <Input value={mobile} onChange={(e) => {
                  empQuery.mobile = e.target.value.trim();
                  this.setState({empQuery});
                }}/>
              </Col>

          </Row>
          <Row type="flex" align="middle" className="marginB-10">
            <Col span={2} className="txt-right">
              <label>所属部门</label>
            </Col>
            <Col className="marginL-10" span={5}>
              <Select className="width-per-100" value={deptId} onChange={(deptId) => {
                this.setState({
                  empQuery: {
                    ...empQuery,
                    ...{ deptId }
                  }});
                  this.fetchPosiList(deptId);
              }} placeholder="请选择" allowClear>
                {
                  deptList.map((deptItem) => {
                    const { id, name } = deptItem;
                    return <Option key={id} value={`${id}`}>{name}</Option>
                  })
                }
              </Select>
            </Col>
            <Col span={2} offset={1} className="txt-right">
              <label>职 位</label>
            </Col>
            <Col className="marginL-10" span={5}>
              <Select className="width-per-100" value={positionId} onChange={(positionId) => {
                this.setState({
                  empQuery: {
                    ...empQuery,
                    ...{ positionId }
                  }});
              }} placeholder="请选择" allowClear>
                {
                  posiList.map((posiItem) => {
                    const { id, name } = posiItem;
                    return <Option key={id} value={`${id}`}>{name}</Option>
                  })
                }
              </Select>
            </Col>
            <Col span={2} offset={1} className="txt-right">
              <label>状 态</label>
            </Col>
            <Col className="marginL-10" span={5}>
              <Select className="width-per-100" value={empQuery.state} onChange={(value) => {
                empQuery.state = value;
                this.setState({empQuery});
              }} placeholder="请选择" allowClear>
                <Option value="1">正常</Option>
                <Option value="0">离职</Option>
              </Select>
            </Col>
          </Row>
          <Row type="flex" justify="end" className="marginB-10">
            <Col span={4} className="txt-center">
              <Button type="primary" className="marginR-10" loading={this.state.loading} onClick= {() => {
                const {pagination} = this.state;
                pagination.current = 1;
                this.setState({pagination});
                this.fetchData();
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

export default Employee;
