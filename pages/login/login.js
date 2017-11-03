var API = require('../../api/api');
var { Storage } = require('../../utils/util');
var MD5 = require('../../assets/js/md5');

const app = getApp()

Page({
  data: {
    chars: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'x', 'y', 'z'],
    loginData: {
      account: '',
      pwd: '',
      devtag: ''
    },
    phoneDisable: true,
    passDisable: true
  },
  loginClick: function() {
    this.setData({'loginData.devtag': this.generateMixed(20)});
    Storage.setStorageSync("mingshi_devtag", this.data.loginData.devtag);
    API.Auth.login(this.data.loginData)
      .then((res) => {
        Storage.setStorageSync("mingshi_token", res.bizData.token);
      },(err) => {
        console.log('登陆错误：', err);
      });
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
  getPhone: function (e) {
    this.setData({
      'loginData.account': e.detail.value.replace(/(^\s*)|(\s*$)/g, "")
    }, () => {
      var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
      myreg.test(this.data.loginData.account) ? this.setData({ phoneDisable: false }) : this.setData({ phoneDisable: true})
    })
  },
  getPassword: function (e) {
    this.setData({
       'loginData.pwd': e.detail.value
    }, () => {
       if (this.data.loginData.pwd != ''){
         this.setData({ 
           passDisable: false,
           'loginData.pwd': MD5(e.detail.value)
         });
       }else {
         this.setData({
           passDisable: true,
           'loginData.pwd': MD5(e.detail.value)
         });
       }
    });
  },
  forgetPwdBtn: function() {
    wx.navigateTo({
      url: '../findpass/findpass'
    })
  }





})
