var Promise = require('./promise');
var Storage = require('./storage');
var UI = require('./ui');

function wxPromisify(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        if (res && res.data.rtnCode == "0000000") {
          //成功
          resolve(res.data)
        } else {
          UI.toast(res.data.msg)
          reject(res.data)
        }
      }
      obj.fail = function (res) {
        UI.toast("哎呀，网络连接出错啦")
        //失败
        reject(res.data)
      }
      fn(obj)
    })
  }
}

//无论promise对象最后状态如何都会执行
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
      value => P.resolve(callback()).then(() => value),
      reason => P.resolve(callback()).then(() => { throw reason })
  );
};

/**
 * 微信请求get方法
 * url
 * data 以对象的格式传入
 */
function getRequest(url, data) {
  var getRequest = wxPromisify(wx.request)
  return getRequest({
    url: url,
    method: 'GET',
    data: data,
    header: {
      'Content-Type': 'json'
    }
  })
}

/**
 * 微信请求post方法封装
 * url
 * params url后缀参数
 * data 以对象的格式传入
 */
function postRequest(url, params, data) {
  var postRequest = wxPromisify(wx.request);

  //url鉴权
  let token = Storage.getStorageSync("mingshi_token");
  if (token) {
    params = params || {};
    params.token = token;
  }

  var i = 0;
  var isHasPraram;

  //检测url
  if (url.indexOf("?") != -1) {
    isHasPraram = true;
  }

  for (var o in params) {
    if (params[o] == undefined || params[o] == null) {
      continue;
    }
    if (i == 0 && !isHasPraram) {
      url += "?" + o + "=" + params[o];
    }
    else {
      url += "&" + o + "=" + params[o];
    }
    i++;
  }

  var postBody = {
    "style": "",
    "clientInfo": {
      "clientType": "web"
    },
    "data": data
  };
  return postRequest({
    url: url,
    method: 'POST',
    data: postBody,
    header: {
      "content-type": "application/json"
    }
  })
}

module.exports = {
  postRequest: postRequest,
  getRequest: getRequest
}
