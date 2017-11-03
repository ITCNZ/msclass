//logs.js
const util = require('../../utils/util.js');
const Filter = util.Filter;

Page({
  data: {
    logs: []
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return Filter.formatTime(new Date(log))
      })
    })
  }
})
