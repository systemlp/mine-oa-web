import 'antd/dist/antd.css';
import React, {Component} from 'react';
import {Table, Checkbox, message} from 'antd';
import {fetchUtil} from '../../../utils/fetchUtil';
import {defaultPagination} from '../../../constants/oaConstants';

class RoleManage extends Component {
  state = {
      data: [],
      pagination: defaultPagination,
      roleQuery: {
        pageSize: 5,
        current: 1
      },
      loading: true,
      checkedRoles: new Set()
  };
  columns = [
    {
        title: '选择',
        dataIndex: 'userRoleId',
        key: 'userRoleId',
        className: 'txt-center',
        width: '20%',
        render: (userRoleId, record, index) => {
          const {checkedRoles} = this.state;
          const {chooiceRole} = this.props;
          return <Checkbox defaultChecked={userRoleId !== null} onChange={ e => {
            if (e.target.checked) {
              checkedRoles.add(record.roleId);
            } else {
              checkedRoles.delete(record.roleId);
            }
            chooiceRole(checkedRoles);
          }} />;
        }
    }, {
        title: '角色编号',
        dataIndex: 'roleId',
        key: 'roleId',
        className: 'txt-center',
        width: '30%'
    }, {
        title: '角色名称',
        dataIndex: 'roleName',
        key: 'roleName',
        className: 'txt-center',
        width: '50%'
    }
  ];
  componentWillMount() {
    this.fetchData();
  }
  fetchData() {
    const {userId} = this.props;
    fetchUtil({
      url: `/userRole/${userId}/findByUserId`,
      method: 'post',
      body: this.state.roleQuery,
      callBack: (result) => {
        this.setState({loading: false});
        if (result.code === 200) {
          const {data} = result;
          const {pagination, checkedRoles} = this.state;
          pagination.total = data.total;
          data.list.forEach(item => {
            if (item.userRoleId) {
              checkedRoles.add(item.roleId);
            }
          })
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
    const {roleQuery} = this.state;
    roleQuery.current = pagination.current;
    roleQuery.pageSize = pagination.pageSize;
    this.setState({pagination, roleQuery});
    this.fetchData();
  }
  render() {
    return (
      <Table columns={this.columns}
        rowKey={record => record.roleId}
        dataSource={this.state.data}
        pagination={this.state.pagination}
        loading={this.state.loading}
        onChange={this.handleTableChange}
      />
    );
  }
}
export default RoleManage;
