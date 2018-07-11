var { Net, Config } = require('../utils/util');

module.exports = {
  /**
   * 根据token提交用户基本信息
   */
  getUserInfo: function () {
    return Net.postRequest(Config.url.teacher + "/user/userInfo", {}, {});
  },

  /**
   * 登陆成功获取用户基本信息
   * @param userId
   */
  getMylearnCourseInfo: function (userId) {
    return Net.postRequest(Config.url.mini + "/courseProgram/getMylearnCourseInfo", {}, { 'userId': userId });
  },

  /**
   * 学习排名
   * @param userId
   */
  getLearnRank: function (userId) {
    return Net.postRequest(Config.url.mini + "/courseProgram/getLearnRank", {}, { 'userId': userId });
  },

  /**
   * 播放历史
   * @param data
   */
  getMyLearnHistory: function (data) {
    return Net.postRequest(Config.url.teacher + "/course/getMyLearnHistory", {}, data);
  },

  /**
   * 我的收藏
   * @param data
   */
  pageMyCollection: function (data) {
    return Net.postRequest(Config.url.teacher + "/collect/pageMyCollection", {}, data);
  }



}
