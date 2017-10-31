import 'antd/dist/antd.css';
import React, {Component} from 'react';
import {Table, Row, Col, message, Button, Input, Select, Icon } from 'antd';
import {fetchUtil} from '../../../utils/fetchUtil';
import {EditableInput, EditableSelect} from '../../../utils/components/editableInput';

const Option = Select.Option;

class Dept extends Component {
    state = {
        data: [],
        pagination: {
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total, range) => {
            return `共${total}条 / 当前${range.join('至')}条`;
          }
        },
        loading: false,
        deptQuery: {},
        editDept: {}
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
              return (
                <EditableInput value={name} editable={record.editable} onChange={ (newName) => {
                  const {editDept} = this.state;
                  editDept.name = newName;
                  this.setState({editDept});
                }} />
              );
            }
        }, {
            title: '父级部门',
            dataIndex: 'parentName',
            key: 'parentName',
            className: 'txt-center',
            width: '25%'
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
              return (
                record.editable ?
                <span><a>保 存</a>&nbsp;&nbsp;&nbsp;&nbsp;<a onClick = {() => this.cancelEdit(index)}>取 消</a></span>
                :
                <a onClick = {() => this.edit(index)}>编 辑</a>
              );
            }
        }
    ];
    componentWillMount() {
      this.fetchData();
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
    handleTableChange(pagination, filters, sorter) {
      const {deptQuery} = this.state;
      deptQuery.current = pagination.current;
      deptQuery.pageSize = pagination.pageSize;
      this.setState({pagination, deptQuery});
      this.fetchData();
    }
    edit(index) {
      const {data} = this.state;
      const editDept = {
        name: data[index].name,
        parentId: data[index].parentId
      };
      data[index].editable = true;
      this.setState({editDept, data});
    }
    cancelEdit(index) {
      const {data} = this.state;
      data[index].editable = null;
      this.setState({data, editDept:{}});
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
                <label>部门名称</label>
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
            <Col span={2} className="txt-center">
              <Button type="primary" loading={this.state.loading} onClick= {() => {
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
        </div>
      );
  }
}

export default Dept;
