var { request, setConfig, Promise } = require('./promise');
var Storage = require('./storage');
var UI = require('./ui');

setConfig({
  concurrency: 10 // 限制最大并发数为 10
});

/**
 * 微信请求get方法
 * url
 * data 以对象的格式传入
 */
function getRequest(url, data) {

  return new Promise((resolver, reject) => {
    request({
      url: url,
      method: 'GET',
      data: data,
      header: {
        'Content-Type': 'json'
      }
    }).then((res) => {
      if (res && res.data.rtnCode == "0000000") {
        //成功
        resolver(res.data)
      } else {
        UI.alert(res.data.msg);
        reject(res.data);
      }
    }).catch(err => {
      UI.alert("哎呀，网络连接出错啦", 'error');
      //失败
      reject(res.data);
    })

  })
}

/**
 * 微信请求post方法封装
 * url
 * params url后缀参数
 * data 以对象的格式传入
 */
function postRequest(url, params, data) {

  //url鉴权
  let token = Storage.getStorageSync("mingshi_token");
  let devtag = Storage.getStorageSync("mingshi_devtag");

  if (token) {
    params = params || {};
    params.token = token;
  }
  if (devtag) {
    params = params || {};
    params.devtag = devtag;
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

  return new Promise((resolver, reject) => {
    request({
      url: url,
      method: 'POST',
      data: postBody,
      dataType: "json",
      header: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      if (res && res.data.rtnCode == "0000000") {
        //成功
        resolver(res.data)
      } else {
        if (res && res.data.rtnCode == "80000009") {
          Storage.removeStorageSync('mingshi_token');
          Storage.removeStorageSync('mingshi_devtag');
          Storage.removeStorageSync('mingshi_userInfo');
          UI.alert("该账号已登录,如非本人操作请立即修改密码!")
            .then(res => {
              wx.reLaunch({
                url: '/pages/auth/login/login'
              })
            });
          return;
        }
        UI.alert(res.data.msg);
        reject(res.data);
      }
    }).catch(err => {
      var pages = getCurrentPages(); //获取加载的页面
      var currentPage = pages[pages.length - 1]; //获取当前页面的对象
      var url = currentPage.route; //当前页面url
      console.log('res-哎呀----', res)
      if (url != 'pages/course/courseDetail/courseDetail') {
        UI.alert("哎呀，网络连接出错啦", 'error');
      }
      //失败
      reject(res.data);
    })
  })

}

module.exports = {
  postRequest: postRequest,
  getRequest: getRequest
}
