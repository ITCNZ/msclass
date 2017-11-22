const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 获取随机字符串
 */
const generateMixed = n => {
  var CHARS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'x', 'y', 'z'];
  var res = "";

  for (var i = 0; i < n; i++) {
    var id = Math.ceil(Math.random() * 45);
    res += CHARS[id];
  }
  return res;
}

/**
 * 转标准时间
 */
const f_min = seconds => {
  if (!seconds) {
    return 0;
  }
  var min = Math.floor(seconds / 60),
    second = seconds % 60,
    hour, newMin, time;

  if (min > 60) {
    hour = Math.floor(min / 60);
    newMin = min % 60;
  }

  if (second < 10) { second = '0' + second; }
  if (min < 10) { min = '0' + min; }
  if (newMin < 10) { newMin = '0' + newMin; }
  return hour ? (hour + ':' + newMin + ':' + second) : (min + ':' + second);
};

/**
 * 学习时长
 */
const f_studyTime = value => {
  if (!value) {
    return '0小时';
  }
  var pat = /^[0-9]*$/;
  if (!pat.exec(value)) {
    return '0小时';
  }
  var time = parseInt(value);
  if (time < 60) {
    return '不到1分钟';
  } else if (time >= 60 && time < 60 * 60) {
    return Math.round(time / 60) + '分钟';
  } else {
    return Math.round(time / 3600) + '小时';
  }
};



module.exports = {
  formatTime: formatTime,
  generateMixed: generateMixed,
  f_min: f_min,
  f_studyTime: f_studyTime
}
