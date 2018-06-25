var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      userInfo: app.globalData.userInfo
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  mpmycode: function () {
    var uid = wx.getStorageSync('uid')
    if (!uid) {
      wx.showModal({
        showCancel: false,
        icon: 'loading',
        title: '获取用户信息失败。请重启后重试！',
        duration: 2000
      })
    }

    var codeModel = new function () { }
    codeModel.scene = 'gid=8'
    codeModel.path = 'pages/contactUser/contactUser'
    codeModel.width = 430
    codeModel.auto_color = false
    codeModel.line_color = { "r": "0", "g": "0", "b": "0" }
    codeModel.is_hyaline = false

    wx.request({
      url: app.d.API_URL + '/api/user/getwxacode',
      method: 'POST',
      data: { info: JSON.stringify(codeModel), gid: uid },
      header: { 'content-Type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        res.data;
        wx.previewImage({
          current: res.data.url,// 当前显示图片的http链接 
          urls: [res.data.url] // 需要预览的图片http链接列表  
        })
      }
    })
  },
})