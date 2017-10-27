import 'antd/dist/antd.css';
import React, {Component} from 'react';
import {Table, Row, Col, message, Button, Input, Select } from 'antd';
import {fetchUtil} from '../../../utils/fetchUtil';

const Option = Select.Option;
const columns = [
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
        width: '25%'
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
        render: (id, record) => {
            return <Button>编辑</Button>
        }
    }
];

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
        deptQuery: {}
    };
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
    handleTableChange = (pagination, filters, sorter) => {
      const {deptQuery} = this.state;
      deptQuery.current = pagination.current;
      deptQuery.pageSize = pagination.pageSize;
      this.setState({pagination, deptQuery});
      this.fetchData();
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
              <Button type="primary" onClick= {() => {
                this.fetchData();
              }}>查询</Button>
            </Col>
          </Row>
          <Table className="marginT-10" columns={columns}
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
