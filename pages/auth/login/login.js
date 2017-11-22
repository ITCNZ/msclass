var API = require('../../../api/api');
var { Storage, Filter, UI } = require('../../../utils/util');
var MD5 = require('../../../assets/js/md5');
const app = getApp()

Page({
  data: {
    loginData: {
      account: '',
      pwd: '',
      devtag: Filter.generateMixed(20)
    },
    phoneDisable: true,
    passDisable: true,
    isAuto: false
  },
  onReady: function() {
    if (Storage.getStorageSync("mingshi_token")) {
      if (app.globalData.systemInfo.system.indexOf('iOS') > -1) { // ios 
        wx.switchTab({
          url: '/pages/usercenter/myCourse/myCourse'
        })
      } else { 
        wx.reLaunch({
          url: '/pages/usercenter/myCourse/myCourse'
        })
      }
    } else {
      this.setData({ isAuto: true })
    }
  },
  loginClick: function() {
    this.setData({
      phoneDisable: true,
      passDisable: true
    });
    UI.toast('正在登录', 'loading')
    Storage.setStorageSync("mingshi_devtag", this.data.loginData.devtag);
    API.Auth.login(this.data.loginData)
      .then(res => {
        Storage.setStorageSync("mingshi_token", res.bizData.token);
        // 登陆成功获取用户信息
        API.User.getUserInfo()
          .then(res => {
            Storage.setStorageSync("mingshi_userInfo", res.bizData);
            wx.reLaunch({
              url: '../../usercenter/myCourse/myCourse'
            })
            this.setData({
              phoneDisable: false,
              passDisable: false
            });
          })
      },(err) => {
        this.setData({
          phoneDisable: false,
          passDisable: false
        });
        wx.hideLoading()
      });
  },
  getPhone: function (e) {
    let inputVal = e.detail.value.replace(/(^\s*)|(\s*$)/g, "");
    this.setData({
      'loginData.account': inputVal
    })
    inputVal.length >= 1 ? this.setData({ phoneDisable: false }) : this.setData({ phoneDisable: true })
  },
  getPassword: function (e) {
    let inputVal = e.detail.value;
    if (inputVal != ''){
      this.setData({ 
        passDisable: false,
        'loginData.pwd': MD5(inputVal)
      });
    }else {
      this.setData({
        passDisable: true,
        'loginData.pwd': MD5(inputVal)
      });
    }
  },
  forgetPwdBtn: function() {
    wx.navigateTo({
      url: '../findpass/findpass'
    })
  }
})
