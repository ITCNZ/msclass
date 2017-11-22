var { request, setConfig, Promise } = require('./promise');

var UI = {
    toast: function(msg, type) {
      return new Promise((resolver, reject) => {
        wx.showToast({
          title: msg,
          icon: type,
          duration: 2000,
          success: resolver,
          fail: reject
        });
      });
    },

    /**
     * 询问窗口
     */
    confirm: function(content, title) {
      title = title || '提示';
      if (title && title == 'error')
        title = '系统提示';

      return new Promise((resolver, reject) => {
        wx.showModal({
          title: title,
          content: content,
          success: resolver,
          fail: reject
        });
      });
    },

    /**
     * alert窗口
     */
    alert: function(content, title) {
      title = title || '提示'
      if (title && title == 'error')
        title = '系统提示';

      return new Promise((resolver, reject) => {
        wx.showModal({
          title: title,
          content: content,
          showCancel: false,
          success: resolver,
          fail: reject
        });
      });
    },

    /**
     * 导航loading
     */
    navLoading: function(flag) {
      flag ? wx.showNavigationBarLoading() : wx.hideNavigationBarLoading()
    }
};


module.exports = UI;
