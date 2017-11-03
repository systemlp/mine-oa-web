import 'antd/dist/antd.css';
import React, {Component} from 'react';
import {Table, Row, Col, message, Button, Input, Select, Popconfirm} from 'antd';
import {fetchUtil} from '../../../utils/fetchUtil';
import {EditableInput, EditableSelect} from '../../../utils/components/editableInput';

const Option = Select.Option;

class position extends Component {
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
        positionQuery: {
          pageSize: 5,
          current: 1
        },
        editPositionMap: new Map(),
        deptList: []
    };
    columns = [
        {
            title: '职位编号',
            dataIndex: 'id',
            key: 'id',
            className: 'txt-center',
            width: '15%'
        }, {
            title: '职位名称',
            dataIndex: 'name',
            key: 'name',
            className: 'txt-center',
            width: '25%',
            render: (name, record, index) => {
              const {editPositionMap} = this.state;
              const editPosition = editPositionMap.get(record.id);
              return (
                <EditableInput value={record.editable ? editPosition.name : name} editable={record.editable} onChange={newName => {
                  editPosition.name = newName;
                  editPositionMap.set(editPosition.id, editPosition);
                  this.setState({editPositionMap});
                }} />
              );
            }
        }, {
            title: '所属部门',
            dataIndex: 'deptName',
            key: 'deptName',
            className: 'txt-center',
            width: '25%',
            render: (deptName, record, index) => {
              const {editPositionMap, deptList} = this.state;
              const editPosition = editPositionMap.get(record.id);
              const data = {
                value: record.editable ? editPosition.deptId : record.deptId,
                text: record.editable ? editPosition.parentName : deptName
              };
              let dataSource = [];
              if(record.editable){
                deptList.map(item => {
                  dataSource.push({
                    value: item.id,
                    text: item.name
                  });
                });
              }
              return (
                <EditableSelect data={data} dataSource={dataSource} editable={record.editable} onChange={result => {
                  if (result) {
                    editPosition.deptId = result[0];
                    editPosition.deptName = result[1];
                  } else {
                    editPosition.deptId = undefined;
                    editPosition.deptName = undefined;
                  }
                  editPositionMap.set(editPosition.id, editPosition);
                  this.setState({editPositionMap});
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
      this.fetchData();
    }
    fetchData() {
      this.setState({ loading: true });
      fetchUtil({
        url: '/position/findPageByParam',
        method: 'post',
        body: this.state.positionQuery,
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
    handleTableChange = (pagination, filters, sorter) => {
      const {positionQuery} = this.state;
      positionQuery.current = pagination.current;
      positionQuery.pageSize = pagination.pageSize;
      this.setState({pagination, positionQuery});
      this.fetchData();
    }
    edit(index) {
      const {data, editPositionMap} = this.state;
      const curData = data[index];
      const editPosition = {
        id: curData.id,
        name: curData.name,
        deptId: curData.deptId,
        deptName: curData.deptName
      };
      curData.editable = true;
      editPositionMap.set(editPosition.id, editPosition);
      this.setState({data, editPositionMap})
    }
    save(index) {
      const {data, editPositionMap} = this.state;
      const curData = data[index];
      const editPosition = editPositionMap.get(curData.id);
      if (curData.name === editPosition.name && curData.deptId === editPosition.deptId) {
        this.cancelEdit(index);
        return;
      }
      fetchUtil({
        url: '/position/merge',
        method: 'post',
        body: editPosition,
        callBack: result => {
          const {code, msg} = result;
          if (code === 200) {
            curData.editable = null;
            curData.name = editDept.name;
            curData.deptId = editDept.deptId;
            curData.deptName = editDept.deptName
            editPosition.delete(curData.id);
            this.setState({data, editPosition});
            message.info(msg);
          } else {
            message.error(msg);
          }
        }
      });
    }
    delete(id) {
      fetchUtil({
        url: `/position/delete/${id}`,
        callBack: result => {
          const {code, msg} = result;
          if (code === 200) {
            message.info(msg);
            const {positionQuery} = this.state;
            positionQuery.current = 1;
            this.setState({positionQuery});
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
      const {data, editPositionMap} = this.state;
      data[index].editable = null;
      const curData = data[index];
      editPositionMap.delete(curData.id);
      this.setState({data, editPositionMap});
    }
    render() {
      const {positionQuery} = this.state;
      return (
        <div>
          <h2>职位管理</h2>
          <Row type="flex" align="middle" className="marginB-10">
              <Col span={2} className="txt-right">
                <label>职位名称</label>
              </Col>
              <Col className="marginL-10" span={5}>
                <Input value={positionQuery.name} onChange={(e) => {
                  positionQuery.name = e.target.value.trim();
                  this.setState({positionQuery});
                }}/>
              </Col>
              <Col span={2} offset={1} className="txt-right">
                <label>所属部门</label>
              </Col>
              <Col className="marginL-10" span={5}>
                <Select className="width-per-100" value={positionQuery.deptId} onChange={(value) => {
                  positionQuery.deptId = value;
                  this.setState({positionQuery});
                }} placeholder="请选择" allowClear>
                  {
                    const {deptList} = this.state;
                    deptList.map(item => {
                      return <Option value={item.id}>{item.name}</Option>
                    });
                  }
                </Select>
              </Col>
              <Col span={2} offset={1} className="txt-right">
                <label>状 态</label>
              </Col>
              <Col className="marginL-10" span={5}>
                <Select className="width-per-100" value={positionQuery.state} onChange={(value) => {
                  positionQuery.state = value;
                  this.setState({positionQuery});
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
