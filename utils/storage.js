var { setConfig, Promise } = require('./promise');

module.exports = {

    getStorageSync: function(key){
        return wx.getStorageSync(key);
    },

    setStorageSync: function(key,value) {
        wx.setStorageSync(key, value);
    },

    removeStorageSync: function(key) {
        wx.removeStorageSync(key);
    },

    clearStorageSync: function() {
        wx.clearStorageSync();
    },

    clearStorage: function() {
        wx.clearStorage();
    },

    removeStorage: function(key) {
        return new Promise((resolver, reject) => {
            wx.removeStorage({
                key: key,
                success: resolver,
                fail: reject
            });
        });
    },

    getStorage: function(key) {
        return new Promise((resolver,reject)=>{
            wx.getStorage({
                key : key,
                success: resolver,
                fail: reject
            });
        });
    },

    setStorage: function(key, value) {
        return new Promise((resolver, reject) => {
            wx.setStorage({
                key: key,
                data: value,
                success: resolver,
                fail: reject
            });
        });

    }

}
