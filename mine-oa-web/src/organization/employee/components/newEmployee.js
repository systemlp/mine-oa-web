import 'antd/dist/antd.css';
import React, {Component} from 'react';
import {Row, Col, Input, Select, DatePicker} from 'antd';
import moment from 'moment';

const Option = Select.Option;
class NewEmployee extends Component {
  render() {
    const {newEmp, deptList, posiList, disabled, modifyNewEmp} = this.props;
    let {userName, email, name, sex, cardType, cardNo, mobile, address, entryDate, deptId, positionId} = newEmp;
    sex!==undefined && (sex=`${sex}`);
    cardType && (cardType=`${cardType}`);
    !!entryDate && (entryDate = moment(entryDate));
    deptId && (deptId=`${deptId}`);
    positionId && (positionId=`${positionId}`);
    if (!disabled && !deptId && deptList && deptList.length > 0) {
      deptId = `${deptList[0].id}`;
    }
    if (!disabled && !positionId && posiList  && posiList.length > 0) {
      positionId = `${posiList[0].id}`;
    }
    const requiredClass = disabled ? '' : 'ant-form-item-required';
    return (
      <div>
        <Row type="flex" align="middle" className="marginB-10">
          <Col span={2} className="txt-right">
            <label className={requiredClass}>用户名</label>
          </Col>
          <Col className="marginL-10" span={5}>
            <Input value={userName} disabled={disabled || newEmp.id!==undefined} onChange={(e) => {
              newEmp.userName = e.target.value.trim();
              modifyNewEmp(newEmp);
            }}/>
          </Col>
          <Col span={2} offset={1} className="txt-right">
            <label className={requiredClass}>邮 箱</label>
          </Col>
          <Col className="marginL-10" span={5}>
            <Input value={email} disabled={disabled} onChange={(e) => {
              newEmp.email = e.target.value.trim();
              modifyNewEmp(newEmp);
            }}/>
          </Col>
          <Col span={2} offset={1} className="txt-right">
            <label className={requiredClass}>姓 名</label>
          </Col>
          <Col className="marginL-10" span={5}>
            <Input value={name} disabled={disabled} onChange={(e) => {
              newEmp.name = e.target.value.trim();
              modifyNewEmp(newEmp);
            }}/>
          </Col>
        </Row>
        <Row type="flex" align="middle" className="marginB-10">
          <Col span={2} className="txt-right">
            <label className={requiredClass}>性 别</label>
          </Col>
          <Col className="marginL-10" span={5}>
            <Select value={sex} disabled={disabled} className="width-per-100" onChange={(sex) => {
              newEmp.sex = parseInt(sex, 10);
              modifyNewEmp(newEmp);
            }}>
              <Option value="2">未知</Option>
              <Option value="0">女</Option>
              <Option value="1">男</Option>
            </Select>
          </Col>
          <Col span={2} offset={1} className="txt-right">
            <label className={requiredClass}>证件类型</label>
          </Col>
          <Col className="marginL-10" span={5}>
            <Select value={cardType} disabled={disabled} className="width-per-100" onChange={(cardType) => {
              newEmp.cardType = parseInt(cardType, 10);
              modifyNewEmp(newEmp);
            }}>
              <Option value="1">身份证</Option>
              <Option value="2">护照</Option>
            </Select>
          </Col>
          <Col span={2} offset={1} className="txt-right">
            <label className={requiredClass}>证件号</label>
          </Col>
          <Col className="marginL-10" span={5}>
            <Input value={cardNo} disabled={disabled} onChange={(e) => {
              newEmp.cardNo = e.target.value.trim();
              modifyNewEmp(newEmp);
            }}/>
          </Col>
        </Row>
        <Row type="flex" align="middle" className="marginB-10">
          <Col span={2} className="txt-right">
            <label className={requiredClass}>手机号</label>
          </Col>
          <Col className="marginL-10" span={5}>
            <Input value={mobile} disabled={disabled} onChange={(e) => {
              newEmp.mobile = e.target.value.trim();
              modifyNewEmp(newEmp);
            }}/>
          </Col>
          <Col span={2} offset={1} className="txt-right">
            <label>地 址</label>
          </Col>
          <Col className="marginL-10" span={5}>
            <Input value={address} disabled={disabled} onChange={(e) => {
              newEmp.address = e.target.value.trim();
              modifyNewEmp(newEmp);
            }}/>
          </Col>
          <Col span={2} offset={1} className="txt-right">
            <label className={requiredClass}>入职日期</label>
          </Col>
          <Col className="marginL-10" span={5}>
            <DatePicker value={entryDate} disabled={disabled} className="width-per-100" onChange={(date, dateStr) => {
              newEmp.entryDate = date.valueOf();
              modifyNewEmp(newEmp);
            }} />
          </Col>
        </Row>
        <Row type="flex" align="middle" className="marginB-10">
          <Col span={2} className="txt-right">
            <label className={requiredClass}>所属部门</label>
          </Col>
          <Col className="marginL-10" span={5}>
            <Select value={deptId} disabled={disabled} className="width-per-100" onChange={(deptId) => {
              newEmp.deptId = parseInt(deptId, 10);
              modifyNewEmp(newEmp);
            }}>
              {
                deptList.map((deptItem) => {
                  const { id, name } = deptItem;
                  return <Option key={id} value={`${id}`}>{name}</Option>;
                })
              }
            </Select>
          </Col>
          <Col span={2} offset={1} className="txt-right">
            <label className={requiredClass}>职 位</label>
          </Col>
          <Col className="marginL-10" span={5}>
            <Select value={positionId} disabled={disabled} className="width-per-100" onChange={(positionId) => {
              newEmp.positionId = parseInt(positionId, 10);
              modifyNewEmp(newEmp);
            }}>
              {
                posiList.map((posiItem) => {
                  const { id, name } = posiItem;
                  return <Option key={id} value={`${id}`}>{name}</Option>;
                })
              }
            </Select>
          </Col>
        </Row>
      </div>
    );
  }
}

export default NewEmployee;
