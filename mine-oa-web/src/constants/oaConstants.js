export const defaultPagination = {
  defaultPageSize: 5,
  showSizeChanger: true,
  pageSizeOptions: ['5', '10', '20', '50'],
  showTotal: (total, range) => {
    return `共${total}条 / 当前${range.join('至')}条`;
  }
};

export const dateFormat = 'YYYY-MM-DD';

const userNameReg = /^[a-zA-Z\d-]{1,20}$/;
const emailReg = /^[a-z0-9]+([._-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
const nameReg = /^[\u4e00-\u9fa5a-zA-Z]{1,30}$/;
const cardNoReg = /^[1-9]\d{16}[\d|X]$/;
const mobileReg = /^1(3[0-9]|4[57]|5[0-35-9]|7[01678]|8[0-9])\d{8}$/;

export const OaReg = {
  testUserName: userName => (userNameReg.test(userName)),
  testEmail : email => (emailReg.test(email)),
  testName : name => (nameReg.test(name)),
  testCardNo : cardNo => (cardNoReg.test(cardNo)),
  testMobile : mobile => (mobileReg.test(mobile))
}
