import 'antd/dist/antd.css';
import React, {Component} from 'react';
import {Table, Row, Col, message, Button, Input, Select, Popconfirm, Modal} from 'antd';
import {fetchUtil} from '../../../utils/fetchUtil';
import {defaultPagination, OaReg} from '../../../constants/oaConstants';
import NewEmployee from './newEmployee';

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
        newEmp: {
          sex: '2',
          cardType: '1'
        },
        empInfo: {},
        modifyEmp: {},
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
            title: '用户名',
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
            title: '所属部门',
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
                <a onClick = {() => this.renderSee(record)}>查看</a>
                &nbsp;&nbsp;&nbsp;&nbsp;
                {
                  state === 1 ?
                  <span>
                    <a onClick = {() => this.renderModify(record)}>编 辑</a>
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
      this.fetchDeptList();
      this.fetchPosiList();
    }
    fetchData() {
      this.setState({ loading: true });
      fetchUtil({
        url: '/employee/findPageByParam',
        method: 'post',
        body: this.state.empQuery,
        callBack: (result) => {
          this.setState({loading: false});
          if (result.code === 200) {
            const {data} = result;
            const {pagination} = this.state;
            pagination.total = data.total;
            this.setState({
              data: data.list,
              pagination
            });
          } else {
            message.error(result.msg);
          }
        }
      });
    }
    fetchDeptList() {
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
    fetchPosiList() {
      fetchUtil({
        url: '/position/findPageByParam',
        method: 'post',
        body: {pageSize: 0, state:1},
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
      const {modal, deptList, posiList} = this.state;
      modal.onCancel = () => {
        this.setState({modal:{}});
      };
      const {type} = modal;
      switch (type) {
        case 'newEmp':
          const {newEmp} = this.state;
          modal.content = <NewEmployee newEmp={newEmp} deptList={deptList} posiList={posiList} modifyNewEmp={ newEmp => this.setState({newEmp}) }/>;
          break;
        case 'seeEmp':
            const {empInfo} = this.state;
            modal.content = <NewEmployee newEmp={empInfo} deptList={deptList} posiList={posiList} disabled={true} />;
            break;
        case 'modifyEmp':
            const {modifyEmp} = this.state;
            modal.content = <NewEmployee newEmp={modifyEmp} deptList={deptList} posiList={posiList} modifyNewEmp={ modifyEmp => this.setState({modifyEmp}) }/>;
            break;
        default:
          modal.content = null;
      }
      return <Modal {...modal}>{modal.content}</Modal>
    }
    checkEmp(emp) {
      const {userName, email, name, sex, cardType, cardNo, mobile, address, entryDate, deptId, positionId} = emp;
      if(!userName || !email || !name || sex===undefined || cardType===undefined || !cardNo
         || !mobile || !entryDate || deptId===undefined || positionId===undefined) {
        message.warn('必填项未填写');
        return false;
      }
      if(!OaReg.testUserName(userName)) {
        message.warn('用户名只能包含最多20个字母、数字及-');
        return false;
      }
      if(!OaReg.testEmail(email)) {
        message.warn('邮箱格式错误');
        return false;
      }
      if(!OaReg.testName(name)) {
        message.warn('姓名只能包含最多30个中文及字母');
        return false;
      }
      if(!OaReg.testCardNo(cardNo)) {
        message.warn('证件号格式错误');
        return false;
      }
      if(!OaReg.testMobile(mobile)) {
        message.warn('手机号格式错误');
        return false;
      }
      if(!address && address.length>100) {
        message.warn('地址只能包含最多100个字符');
        return false;
      }
      return true;
    }
    insertEmp(newEmp) {
      if(!this.checkEmp(newEmp)) return;
      fetchUtil({
        url: '/employee/insert',
        method: 'post',
        body: newEmp,
        callBack: result => {
          const {code, msg} = result;
          switch (code) {
            case 200:
              message.success(msg);
              const {pagination} = this.state;
              pagination.current = 1;
              this.setState({pagination, modal: {}, newEmp: {}});
              this.fetchData();
              break;
            case 403:
              message.warn(msg);
              this.fetchDeptList();
              this.fetchPosiList();
              break;
            default:
              message.error(result.msg);
          }
        }
      });
    }
    modifyEmp(modifyEmp) {
      if(!this.checkEmp(modifyEmp)) return;
      fetchUtil({
        url: '/employee/modify',
        method: 'post',
        body: modifyEmp,
        callBack: result => {
          const {code, msg} = result;
          switch (code) {
            case 200:
              message.success(msg);
              const {pagination} = this.state;
              pagination.current = 1;
              this.setState({pagination, modal: {}, modifyEmp: {}});
              this.fetchData();
              break;
            case 403:
              message.warn(msg);
              this.fetchDeptList();
              this.fetchPosiList();
              break;
            default:
              message.error(result.msg);
          }
        }
      });
    }
    renderInsert() {
      const modal =  {
        visible: true,
        title: '新增员工',
        type: 'newEmp',
        width: '920px',
        onOk: () => {
          const {newEmp} = this.state;
          this.insertEmp(newEmp);
        }
      };
      this.setState({modal});
    }
    renderSee(empInfo) {
      const modal =  {
        visible: true,
        title: '员工信息',
        type: 'seeEmp',
        width: '920px',
        footer: null
      };
      this.setState({modal, empInfo});
    }
    renderModify(modifyEmp) {
      modifyEmp = Object.assign({}, modifyEmp);
      const modal =  {
        visible: true,
        title: '编辑员工信息',
        type: 'modifyEmp',
        width: '920px',
        onOk: () => {
          const {modifyEmp} = this.state;
          this.modifyEmp(modifyEmp);
        }
      };
      this.setState({modal, modifyEmp});
    }
    render() {
      const { empQuery, deptList, posiList } = this.state;
      return (
        <div>
          <h2>员工管理</h2>
          <Row type="flex" align="middle" className="marginB-10">
              <Col span={2} className="txt-right">
                <label>用户名</label>
              </Col>
              <Col className="marginL-10" span={5}>
                <Input onChange={(e) => {
                  empQuery.userName = e.target.value.trim();
                  this.setState({empQuery});
                }}/>
              </Col>
              <Col span={2} offset={1} className="txt-right">
                <label>姓 名</label>
              </Col>
              <Col className="marginL-10" span={5}>
                <Input onChange={(e) => {
                  empQuery.name = e.target.value.trim();
                  this.setState({empQuery});
                }}/>
              </Col>
              <Col span={2} offset={1} className="txt-right">
                <label>手机号</label>
              </Col>
              <Col className="marginL-10" span={5}>
                <Input onChange={(e) => {
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
              <Select className="width-per-100" onChange={(deptId) => {
                this.setState({
                  empQuery: {
                    ...empQuery,
                    ...{ deptId }
                  }});
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
              <Select className="width-per-100" onChange={(positionId) => {
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
              <Select className="width-per-100" onChange={(value) => {
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
