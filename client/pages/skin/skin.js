var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current_idx:null,
    skincolordata: [{ val: 'img', value_color: 'http://5b0988e595225.cdn.sohucs.com/images/20180605/9a5e1d48362348079f7e359b3962acdb.png' },{ val: 'color', value_color: '#dd333a' },{ val: 'color', value_color: '#d533aa' }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    that.get_allskin()
    that.get_currentuserskin()
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
  // 设置skin
  setcolor:function(e){    
    var that = this
    var idx = e.currentTarget.dataset.idx
    var color = that.data.skincolordata[idx]
    var uid = wx.getStorageSync('uid');
  //  console.log('idx', idx)
    if (idx == that.data.current_idx){
      wx.showToast({
        title: '设置成功',
        icon: 'none',
        duration: 2000
      });
      return true
    }

    wx.request({
      url: app.d.API_URL + '/Api/User/set_userskin',
      method: 'post',
      data: { info: JSON.stringify(color),uid:uid },
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        if (res.data.status === 1) {
          
          wx.showToast({
            title: '设置成功',
            icon: 'none',
            duration: 2000
          });
          that.setData({
            current_idx: idx
          })
         
        }else{
          wx.showToast({
            title: '设置出错',
            icon: 'none',
            duration: 2000
          });
        }        
      }

    })
  },
  // 获取当前用户的风格设置
  get_currentuserskin:function(){
    var that = this
    var uid = wx.getStorageSync('uid');
    wx.request({
      url: app.d.API_URL + '/Api/User/get_userskin',
      method: 'post',
      data: {  uid: uid },
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        if (res.data.status === 1) {
          var currentskin = res.data.skindata
          var allskin = that.data.skincolordata
          for(var i = 0;i<allskin.length;i++){
            // console.log(currentskin.val)
             if(allskin[i].val == currentskin.val && allskin[i].value_color == currentskin.value_color){
               console.log('i',i)
               that.setData({
                 current_idx: i
               })
             }
          }
        }
      }
    })

  },
  // 获取所有风格
  get_allskin:function(){    
    var that = this
    wx.request({
      url: app.d.API_URL + '/Api/User/get_allskin',
      method: 'post',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        if (res.data.status === 1) {
          that.setData({
            skincolordata: res.data.skindata
          })
        }
      }
    })
  }
})