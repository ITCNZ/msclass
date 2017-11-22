var { Net, Config } = require('../utils/util');

module.exports = {

  /**
   * 根据token获取用户的基本信息
   */
  getUserInfo: function() {
    return Net.postRequest(Config.url.teacher + "/user/userInfo", {}, {});
  },

  /**
   * 修改用户信息
   * @param data
   */
  updateUserInfo: function(data) {
    return Net.postRequest(Config.url.teacher + "/user/updateUserInfo", {}, data);
  },

  /**
   * 用户中心用户自己修改密码
   * @param data
   */
  updateUserPassword: function(data) {
    return Net.postRequest(Config.url.teacher + "/user/updateUserPassword", {}, data);
  },

  /**
   * 用户中心观看时长
   * @param userId
   */
  getMylearnCourseInfo: function (userId) {
    return Net.postRequest(Config.url.mini + "/courseProgram/getMylearnCourseInfo", {}, { 'userId': userId});
  }

}
