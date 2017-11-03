var API = require('../../api/api');
var { Storage, UI } = require('../../utils/util');
var MD5 = require('../../assets/js/md5');

const app = getApp()

Page({
  data: {
    chars: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'x', 'y', 'z'],
    phone: '',
    code: '',
    devtag: '',
    phoneDisable: true,
    codeDisable: true,
    showLEditPass: false,
    newpassDisable: true,
    repassDisable: true,
    repassData: {
      "phone": '',
      "password": '',
      "repassword": '',
      "code": '',
      "devtag": ''
    }
  },
  getPhone: function (e) {
    this.setData({
      phone: e.detail.value.replace(/(^\s*)|(\s*$)/g, "")
    }, () => {
      var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
      myreg.test(this.data.phone) ? this.setData({ phoneDisable: false }) : this.setData({ phoneDisable: true })
    })
  },
  getCode: function (e) {
    this.setData({
      code: e.detail.value.replace(/(^\s*)|(\s*$)/g, "")
    }, () => {
      this.data.code != '' ? this.setData({ codeDisable: false}) : this.setData({ codeDisable: true});
    })
  },
  getcodeBtn: function () {
    API.Auth.sendCode(this.data.phone)
      .then((res) => {
        UI.toast("发送成功!");
      });
  },
  nextBtnClick: function () {
    API.Auth.validateCode(this.data.phone, this.data.code)
      .then((res) => {
        this.setData({showLEditPass: true})
      });
  },
  newPass: function (e) {
    this.setData({
      'repassData.password': e.detail.value
    }, () => {
      this.data.repassData.password != '' ? this.setData({newpassDisable: false}) : this.setData({newpassDisable: true});
    })
  },
  rePass: function (e) {
    this.setData({
      'repassData.repassword': e.detail.value
    }, () => {
      this.data.repassData.repassword != '' ? this.setData({repassDisable: false}) : this.setData({repassDisable: true});
    })
  },
  // 随机字符串
  generateMixed: function (n) {
    var res = "";
    for (var i = 0; i < n; i++) {
      var id = Math.ceil(Math.random() * 45);
      res += this.data.chars[id];
    }
    return res;
  },
  resetPwdBtn: function () {
    let data = {
      'devtag': this.generateMixed(20),
      'code': this.data.code,
      'phone': this.data.phone,
      'password': MD5(this.data.repassData.password),
      'repassword': MD5(this.data.repassData.repassword)
    };

    API.Auth.updatePassword(data)
      .then((res) => {
        UI.toast("重置密码成功!");
      });
  }
})
