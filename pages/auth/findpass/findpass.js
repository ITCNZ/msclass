var API = require('../../../api/api');
var { Storage, UI, Filter } = require('../../../utils/util');
var MD5 = require('../../../assets/js/md5');

const app = getApp()

Page({
  data: {
    phone: '',
    code: '',
    phoneDisable: true,
    codeDisable: true,
    showLEditPass: false, // 显示输入密码框
    newpassDisable: true,
    repassDisable: true,
    repassData: {
      "phone": '',
      "password": '',
      "repassword": '',
      "code": '',
      "devtag": ''
    },
    backTime: '获取短信验证码',
    isbackBtn: false
  },
  getPhone: function (e) {
    let inputVal = e.detail.value.replace(/(^\s*)|(\s*$)/g, "")
    this.setData({
      phone: inputVal
    })

    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    myreg.test(inputVal) ? this.setData({ phoneDisable: false }) : this.setData({ phoneDisable: true })

  },
  getCode: function (e) {
    let inputVal = e.detail.value.replace(/(^\s*)|(\s*$)/g, "");
    this.setData({
      code: inputVal
    })
    inputVal != '' ? this.setData({ codeDisable: false }) : this.setData({ codeDisable: true });
  },
  getcodeBtn: function () {
    API.Auth.sendCode(this.data.phone)
      .then(res => {
        this.setData({isbackBtn: true})
        UI.toast("发送成功")
          .then(() => {
            let time = 60;
            let timer = setInterval(() => {
              if (time == 0) {
                this.setData({ 
                  backTime: '获取验证码',
                  isbackBtn: false
                })
                clearInterval(timer);
              } else {
                time = time - 1;
                this.setData({ backTime: time + 's后重新发送'})
              }
            }, 1000)
          });
      });
  },

  nextBtnClick: function () {
    API.Auth.validateCode(this.data.phone, this.data.code)
      .then((res) => {
        this.setData({showLEditPass: true});
      });
  },
  newPass: function (e) {
    let inputVal = e.detail.value;
    this.setData({
      'repassData.password': inputVal
    })
    if (inputVal.length >= 6 && inputVal.length <= 12) {
      this.setData({ newpassDisable: false });
    } else {
      this.setData({ newpassDisable: true });
    }
  },
  rePass: function (e) {
    let inputVal = e.detail.value;
    this.setData({
      'repassData.repassword': inputVal
    })
    if(inputVal.length >= 6 && inputVal.length <= 12) {
      this.setData({ repassDisable: false });
    } else {
      this.setData({ repassDisable: true });
    }
    
  },
  resetPwdBtn: function () {
    let data = {
      'devtag': Filter.generateMixed(20),
      'code': this.data.code,
      'phone': this.data.phone,
      'password': MD5(this.data.repassData.password),
      'repassword': MD5(this.data.repassData.repassword)
    };

    API.Auth.updatePassword(data)
      .then((res) => {
        UI.toast("重置密码成功",'loading');
        wx.navigateTo({
          url: '../login/login'
        })
      });
  }
})
