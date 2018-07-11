



// components/searchBar/searchBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    inputValue: {
      type: String,
      value: '',
      observer: function (newVal, oldVal) {
        console.log('newVal', newVal)
        console.log('oldVal', oldVal)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    valLength: false,
    focus: true,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 输入文字
     */
    _inputFn: function (e) {
      this.setData({
        inputValue: e.detail.value
      })
      e.detail.value.length > 0 ? this.setData({ valLength: true }) : this.setData({ valLength: false })
    },

    /**
     * 获得焦点
     */
    _focusFn: function (e) {
      this.setData({
        focus: true
      })
    },

    /**
     * 失去焦点
     */
    _blurFn: function (e) {
      // console.log('e', e)
    },

    /**
     * 清除数据
     */
    _clearInput: function () {
      this.setData({
        inputValue: '',
        valLength: false
      })
    },

    /**
     * 点击软键盘搜索
     */
    _confirmFn: function () {
      this.searchFn()
    },

    /**
     * 搜索事件
     */
    searchFn: function () {
      var myEventDetail = { inputValue: this.data.inputValue} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
    
      this.triggerEvent('searchfn', myEventDetail, myEventOption)
    }

  }
})
