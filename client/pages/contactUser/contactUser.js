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
    var uid = wx.getStorageSync('uid');
    that.setData({
        gid:options.gid
    })
    // 用户信息
    wx.request({
      url: app.d.API_URL + '/Api/User/userinfo',
      method: 'post',
      data: { uid:that.data.gid },
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      success: function (b) {
        if (b.data.status === 1) {
          that.setData({
            index1: 'none',
            index2: 'flex',
            userDetail: b.data.userinfo
          });
        }else{
          wx.showToast({
            title: '出错！',
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
    // 判断收藏
    wx.request({
      url: app.d.API_URL + '/Api/User/iscolle',
      method:'GET',
      data: { uid: uid, guid:that.data.gid},
      success: function (res) {
        that.setData({
          is_coll:res.data.iscolle
        })
      }

    })
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
    var that = this
    that.get_userskin();
    
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
  // 打开我的名片
  collCard: function () {
    wx.switchTab({
      url: '../index/index'
    })
  },
  // 收藏或取消名片
  coll:function(e){
    console.log(e);
    var that = this;
    var uid = wx.getStorageSync('uid');
    var openid = that.data.userDetail.openid;
    var formid = e.detail.formId
    wx.request({
      url: app.d.API_URL + '/Api/User/coll',
      method: 'GET',
      data: { 
        uid:uid,
        touid:that.data.gid,
        openid:openid,
        formid:formid,
        username: that.data.userDetail.username,
        company: that.data.userDetail.company,
        position: that.data.userDetail.position,
      },
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log(res)
        that.setData({
          is_coll:res.data.flag
        })
      }
    })
  },
  // 获取skin信息
  get_userskin: function () {
    var that = this
    var uid = wx.getStorageSync('uid')
    wx.request({
      url: app.d.API_URL + '/Api/User/get_userskin',
      method: 'post',
      data: { uid: that.data.gid },
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        if (res.data.status === 1) {
          that.setData({
            skinval: res.data.skindata.val ? res.data.skindata.val:'color',
            skinvalue: res.data.skindata.value_color ? res.data.skindata.value_color:'#000'
          })
        }
      }
    })
  },
})