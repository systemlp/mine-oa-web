import 'antd/dist/antd.css';
import React, {Component} from 'react';
import {Table, Row, Col, message, Button, Input, Select, Popconfirm} from 'antd';
import {fetchUtil} from '../../../utils/fetchUtil';
import {EditableInput, EditableSelect} from '../../../utils/components/editableInput';

const Option = Select.Option;

class Dept extends Component {
    state = {
        data: [],
        pagination: {
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20', '50'],
          showTotal: (total, range) => {
            return `共${total}条 / 当前${range.join('至')}条`;
          }
        },
        loading: false,
        deptQuery: {
          pageSize: 5,
          current: 1
        },
        editDeptMap: new Map(),
        parentDeptMap: new Map()
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
                  dataSource.push({
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
                        <Popconfirm title="确定删除吗?" onConfirm={() => this.delete(id)}>
                          <a>删 除</a>
                        </Popconfirm>
                      </span>
                      :
                      null
                    }
                  </span>
                  :
                  <span>
                    <a onClick = {() => this.edit(index)}>编 辑</a>
                    {
                      state === 1 ?
                      <span>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Popconfirm title="确定删除吗?" onConfirm={() => this.delete(id)}>
                          <a>删 除</a>
                        </Popconfirm>
                      </span>
                      :
                      null
                    }
                  </span>
                }
              </div>;
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
            const deptList = result.data;
            parentDeptMap.set(curData.id, deptList);
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
          if (code === 200) {
            curData.editable = null;
            curData.name = editDept.name;
            curData.parentId = editDept.parentId;
            curData.parentName = editDept.parentName
            this.setState({data, editDeptMap: new Map()});
            message.info(msg);
          } else {
            message.error(msg);
          }
        }
      });
    }
    delete(id) {
      fetchUtil({
        url: `/dept/delete/${id}`,
        callBack: result => {
          const {code, msg} = result;
          if (code === 200) {
            message.info(msg);
            const {deptQuery} = this.state;
            deptQuery.current = 1;
            this.setState({deptQuery});
            this.fetchData();
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
    cancelEdit(index) {
      const {data, editDeptMap} = this.state;
      data[index].editable = null;
      const curData = data[index];
      editDeptMap.delete(curData.id);
      this.setState({data, editDeptMap});
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
            <Col span={2} className="txt-center">
              <Button type="primary" loading={this.state.loading} onClick= {() => {
                const {pagination} = this.state;
                pagination.current = 1;
                pagination.pageSize = 5;
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
