var {Net, Config} = require('../utils/util');

module.exports = {

  /**
   * 获取顶部轮播图
   */
  getBanners: function(data) {
    return Net.postRequest(Config.url.boss + "/banner/getOnlineBanner", {}, data);
  }



}