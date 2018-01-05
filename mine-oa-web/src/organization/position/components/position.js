import 'antd/dist/antd.css';
import React, {Component} from 'react';
import {Table, Row, Col, message, Button, Input, Select, Popconfirm, Modal} from 'antd';
import {fetchUtil} from '../../../utils/fetchUtil';
import {EditableInput} from '../../../utils/components/editableInput';
import {defaultPagination} from '../../../constants/oaConstants';

const Option = Select.Option;

class Position extends Component {
    state = {
        data: [],
        pagination: defaultPagination,
        loading: false,
        positionQuery: {
          pageSize: 5,
          current: 1
        },
        editPositionMap: new Map(),
        modal: {},
        insertPosition: {}
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
            width: '35%',
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
        name: curData.name
      };
      curData.editable = true;
      editPositionMap.set(editPosition.id, editPosition);
      this.setState({data, editPositionMap});
    }
    save(index) {
      const {data, editPositionMap} = this.state;
      const curData = data[index];
      const editPosition = editPositionMap.get(curData.id);
      if (curData.name === editPosition.name) {
        this.cancelEdit(index);
        return;
      }
      fetchUtil({
        url: '/position/merge',
        method: 'post',
        body: editPosition,
        callBack: result => {
          const {code, msg} = result;
          switch (code) {
            case 200:
              curData.editable = null;
              curData.name = editPosition.name;
              editPositionMap.delete(curData.id);
              this.setState({data, editPosition});
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
        url: `/position/delete/${curData.id}`,
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
        url: `/position/enable/${curData.id}`,
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
      const {data, editPositionMap} = this.state;
      data[index].editable = null;
      const curData = data[index];
      editPositionMap.delete(curData.id);
      this.setState({data, editPositionMap});
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
        case 'insertPosition':
          const {insertPosition} = this.state;
          let {name} = insertPosition;
          modal.content = <div>
            <Row type="flex" align="middle" className="marginB-10">
                <Col span={6} className="txt-right">
                  <label>职位名称</label>
                </Col>
                <Col span={12} offset={1}>
                  <Input value={name} onChange={(e) => {
                    name = e.target.value.trim();
                    insertPosition.name = name;
                    this.setState({insertPosition});
                  }}/>
                </Col>
            </Row>
          </div>;
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
      const {insertPosition} = this.state;
      const modal =  {
        visible: true,
        title: '新增职位',
        type: 'insertPosition',
        onOk: () => {
          if (!insertPosition.name) {
            message.warning('请输入职位名称！');
            return;
          }
          fetchUtil({
            url: '/position/insert',
            method: 'POST',
            body: insertPosition,
            callBack: (result) => {
              const {code, msg} = result;
              switch (code) {
                case 200:
                  message.success(msg);
                  this.setState({modal: {}, insertPosition: {}});
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
    render() {
      const {
        positionQuery,
      } = this.state;
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

export default Position;
