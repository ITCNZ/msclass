var API = require('../../../api/api');
var { Storage, Filter, UI } = require('../../../utils/util');
var MD5 = require('../../../assets/js/md5');

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
  // onLoad: function (options) {
  //   var scan_url = decodeURIComponent(options.q)
  //   console.log('这是扫码参数', scan_url)
  // },
  onReady: function() {
    if (Storage.getStorageSync("mingshi_token")) {
      if (app.globalData.systemInfo.system.indexOf('iOS') > -1) { // ios 
        wx.switchTab({
          url: '/pages/home/home'
        })
      } else { 
        wx.reLaunch({
          url: '/pages/home/home'
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
    UI.toast('正在登录', 'loading');
    UI.navLoading(true);
    Storage.setStorageSync("mingshi_devtag", this.data.loginData.devtag);
    API.Auth.login(this.data.loginData)
      .then(res => {
        Storage.setStorageSync("mingshi_token", res.bizData.token);
      }).then(res => {
        // 登陆成功获取用户信息
        API.User.getUserInfo()
          .then(res => {
            UI.navLoading(false);
            Storage.setStorageSync("mingshi_userInfo", res.bizData);
            wx.reLaunch({
              url: '/pages/home/home'
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
