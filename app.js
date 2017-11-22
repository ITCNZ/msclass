//app.js
App({
  onLaunch: function () {

    // 系统版本相关
    wx.getSystemInfo({
      success: res => {
        this.globalData.systemInfo = res;
      }
    })
  },
  globalData: {
    systemInfo:null
  }
})