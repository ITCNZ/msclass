var { Net, Config } = require('../utils/util');

module.exports = {

  /**
   * 登录
   * @param data
   */
  login: function(data) {
    return Net.postRequest(Config.url.teacher + "/login/login", {}, data);
  },

  /**
   * 修改密码发送验证码
   * @param phone手机号
   */
  sendCode: function(phone) {
    return Net.postRequest(Config.url.teacher + "/login/sendCode", {}, { 'phone': phone});
  },

  /**
   * 校验验证码
   * @param phone手机号
   * @param code验证码
   */
  validateCode: function (phone, code) {
    return Net.postRequest(Config.url.teacher + "/login/validateCode", {}, { 'phone': phone, 'code': code });
  },

  /**
   * 修改密码
   * @param data
   */
  updatePassword: function(data) {
    return Net.postRequest(Config.url.teacher + "/login/updatePassword", {}, data);
  }

}