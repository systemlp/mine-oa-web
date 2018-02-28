import 'antd/dist/antd.css';
import React, {Component} from 'react';
import {Table, Row, Col, message, Button, Input, Select, Modal} from 'antd';
import {fetchUtil} from '../../../utils/fetchUtil';
import {defaultPagination} from '../../../constants/oaConstants';
import RoleManage from './roleManage';

const Option = Select.Option;

class UserRole extends Component {
    state = {
        data: [],
        pagination: defaultPagination,
        loading: false,
        empQuery: {
          pageSize: 5,
          current: 1
        },
        modal: {},
        checkedRoles: new Set()
    };
    columns = [
        {
            title: '用户编号',
            dataIndex: 'userId',
            key: 'userId',
            className: 'txt-center',
            width: '9%'
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
            width: '14%'
        }, {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            className: 'txt-center',
            width: '10%'
        }, {
            title: '手机号',
            dataIndex: 'mobile',
            key: 'mobile',
            className: 'txt-center',
            width: '14%'
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
              return state === 1 ? '正常' : '删除';
            }
        }, {
            title: '操作',
            dataIndex: 'userId',
            key: 'operate',
            className: 'txt-center',
            render: (userId, record, index) => {
              // const {state} = record;
              return <a onClick={() => this.renderRoleModal(userId)}>角色管理</a>;
            }
        }
    ];
    componentWillMount() {
      this.fetchData();
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
    handleTableChange = (pagination, filters, sorter) => {
      const {empQuery} = this.state;
      empQuery.current = pagination.current;
      empQuery.pageSize = pagination.pageSize;
      this.setState({pagination, empQuery});
      this.fetchData();
    }
    renderRoleModal(userId) {
      const modal =  {
        visible: true,
        title: '角色管理',
        type: 'roleMange',
        onOk: () => {
          // console.log([...this.state.checkedRoles]);
          fetchUtil({
            url: `/userRole/${userId}/roleManage`,
            method: 'POST',
            body: [...this.state.checkedRoles],
            callBack: (result) => {
              const {code, msg} = result;
              switch (code) {
                case 200:
                  message.success(msg);
                  this.setState({modal:{}, checkedRoles: new Set()});
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
      this.setState({modal, userId});
    }
    renderModal() {
      const {modal, userId, checkedRoles} = this.state;
      modal.onCancel = () => {
        this.setState({modal:{}});
      };
      const {type} = modal;
      switch (type) {
        case 'roleMange':
          modal.content = <RoleManage userId={userId}
            roleIdSet={checkedRoles}
            chooiceRole={checkedRoles => this.setState({checkedRoles})}
          />
          break;
        default:
          modal.content = null;
      }
      return <Modal {...modal}>{modal.content}</Modal>
    }
    render() {
      const { empQuery} = this.state;
      return (
        <div>
          <h2>用户角色管理</h2>
          <Row type="flex" align="middle" className="marginB-10 marginL-10">
              <Col span={1} className="txt-right">
                <label>用户名</label>
              </Col>
              <Col className="marginL-10" span={4}>
                <Input onChange={(e) => {
                  empQuery.userName = e.target.value.trim();
                  this.setState({empQuery});
                }}/>
              </Col>
              <Col span={1} offset={1} className="txt-right">
                <label>姓 名</label>
              </Col>
              <Col className="marginL-10" span={4}>
                <Input onChange={(e) => {
                  empQuery.name = e.target.value.trim();
                  this.setState({empQuery});
                }}/>
              </Col>
              <Col span={1} offset={1} className="txt-right">
                <label>手机号</label>
              </Col>
              <Col className="marginL-10" span={4}>
                <Input onChange={(e) => {
                  empQuery.mobile = e.target.value.trim();
                  this.setState({empQuery});
                }}/>
              </Col>
              <Col span={1} offset={1} className="txt-right">
                <label>状 态</label>
              </Col>
              <Col className="marginL-10" span={4}>
                <Select className="width-per-100" onChange={(value) => {
                  empQuery.state = value;
                  this.setState({empQuery});
                }} placeholder="请选择" allowClear>
                  <Option value="1">正常</Option>
                  <Option value="0">删除</Option>
                </Select>
              </Col>
          </Row>
          <Row type="flex" justify="end" className="marginB-10">
            <Col span={2} className="txt-center">
              <Button type="primary" loading={this.state.loading} onClick= {() => {
                const {pagination} = this.state;
                pagination.current = 1;
                this.setState({pagination});
                this.fetchData();
              }}>查询</Button>
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

export default UserRole;
