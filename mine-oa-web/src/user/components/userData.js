import 'antd/dist/antd.css';
import './userData.css';
import {connect} from 'react-redux';
import React, { Component } from 'react';
import { Row, Col, message, Upload, Button, Icon } from 'antd';
import { fetchUtil } from '../../utils/fetchUtil';
import {setUser} from '../redux/actions/setUser';

class UserData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: {}
        }
    }
    componentWillMount() {
        fetchUtil({
            url: '/user/findDataByUserName',
            callBack: (result) => {
                if (result.code === 200) {
                  this.setState({userData: result.data});
                } else {
                    message.error(result.msg);
                }
            }
        });
    }
    getBase64(img, callback) {
      const reader = new FileReader();
      reader.addEventListener('load', () => callback(reader.result));
      reader.readAsDataURL(img);
    }
    beforeUpload(file) {
      // 上传前判断图片是否符合指定
      const isImg = file.type === 'image/jpeg' ||  file.type === 'image/png';
      if (!isImg) {
        message.error('仅支持上传 JPG, JPEG, PNG 格式文件');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('图像文件必须小于2MB!');
      }
      return isImg && isLt2M;
    }
    handleChange = (info) => {
      // 上传前、上传完成、失败都会调用
      if (info.file.status === 'uploading') {
        this.setState({ loading: true });
        return;
      }
      if (info.file.status === 'done') {
        this.getBase64(info.file.originFileObj, photoUrl => {
          // 上传完成后修改当前页面state、redux及浏览器缓存
          const {userData} = this.state;
          const {setUser} = this.props;
          userData.photoUrl = photoUrl;
          const user = JSON.parse(sessionStorage.getItem('user'));
          user.photoUrl = photoUrl;
          sessionStorage.setItem('user', JSON.stringify(user));
          setUser(user);
          this.setState({
            userData,
            loading: false,
          });
        });
      }
    }
    render() {
      const {userName, email, photoUrl, name, sex, cardType, cardNo, mobile, address, deptName, posName} = this.state.userData;
      const token = {
        token: sessionStorage.getItem('token')
      };
      return (
          <div className="userData">
              <h2>个人资料</h2>
              <Row type="flex" justify="center" align="middle">
                  <Col span={3}>
                    <img className="userImg" src={photoUrl} alt=""/>
                  </Col>
                  <Col span={3}>
                      <Upload
                        name="userPhoto"
                        showUploadList={false}
                        action="//localhost:8080/user/uploadUserPhoto"
                        data={token}
                        beforeUpload={this.beforeUpload}
                        onChange={this.handleChange}>
                        <Button>
                          <Icon type="upload" />更换头像
                        </Button>
                      </Upload>
                  </Col>
                  <Col span={14}>
                  </Col>
              </Row>
              <Row type="flex" justify="center" align="middle">
                  <Col span={10}>
                    <label>用户名：</label>
                    <span>{userName}</span>
                  </Col>
                  <Col span={10}>
                    <label>邮箱：</label>
                    <span>{email}</span>
                  </Col>
              </Row>
              <Row type="flex" justify="center" align="middle">
                  <Col span={10}>
                    <label>姓名：</label>
                    <span>{name}</span>
                  </Col>
                  <Col span={10}>
                    <label>性别：</label>
                    <span>{sex===0?'女':sex === 1?'男':'未知'}</span>
                  </Col>
              </Row>
              <Row type="flex" justify="center" align="middle">
                  <Col span={10}>
                      <label>证件类型：</label>
                      <span>{cardType===1?'身份证':cardType === 2?'护照':'未知'}</span>
                  </Col>
                  <Col span={10}>
                    <label>证件号：</label>
                    <span>{cardNo}</span>
                  </Col>
              </Row>
              <Row type="flex" justify="center" align="middle">
                  <Col span={10}>
                    <label>手机号：</label>
                    <span>{mobile}</span>
                  </Col>
                  <Col span={10}>
                    <label>地址：</label>
                    <span>{address}</span>
                  </Col>
              </Row>
              <Row type="flex" justify="center" align="middle">
                  <Col span={10}>
                    <label>所属部门：</label>
                    <span>{deptName}</span>
                  </Col>
                  <Col span={10}>
                    <label>职位：</label>
                    <span>{posName}</span>
                  </Col>
              </Row>
          </div>
      );
    }
}

const mapStateToProps = (state) => ({user: state.setUser.user})

const mapDispatchToProps = (dispatch) => ({
    setUser: user => dispatch(setUser(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(UserData);
