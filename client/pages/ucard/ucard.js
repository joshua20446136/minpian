// pages/ucard/ucard.js
var app = getApp()
Page({
  data:{
    userInfo:{},
    userDetail: { address: '定位你的位置'}
  },
  // 页面初始化
  onLoad:function(options){  
    var that = this
    var uid = wx.getStorageSync('uid')
    //调用应用实例的方法获取全局数据
    wx.getUserInfo({
      success:function(res){
        //更新数据
        that.setData({
          userInfo:res.userInfo
        })
      }
    })
    wx.request({
      url: app.d.API_URL + '/Api/User/userinfo',
      data:{uid:uid,type:2},
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method:'POST',
      success: function (a) {
        console.log(a)
        that.setData({
           userDetail:a.data.userinfo
        })
      }
    })
  },
  // 修改用户信息
  formSubmit: function(e) {
    var that = this
    var uid = wx.getStorageSync('uid')
    wx.request({
      url: app.d.API_URL + '/Api/User/user_edit',
      data:{
        username:e.detail.value.username,
        company:e.detail.value.company,
        position:e.detail.value.position,
        tel: e.detail.value.tel,
        phone: e.detail.value.phone,
        address: e.detail.value.address,        
        latitude: that.data.userDetail['latitude'],
        longitude: that.data.userDetail['longitude'],
        detailInfo: e.detail.value.detailInfo,
        uid:uid
      },
      method:'POST',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      success: function (str) {
        if(str.data.flag === 1){
          wx.switchTab({
            url: '../index/index',
            success: function () {
              wx.showToast({
                title: str.data.msg,
                icon: 'success',
                duration: 2000
              })
            }
          })
        }else{
          wx.showToast({
            title: str.data.msg,
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
  },
  onPullDownRefresh: function(){
    wx.stopPullDownRefresh()
  },
  // 获取地址信息
  getchooseLocation:function(){
    var that = this;
    wx.chooseLocation({
      success:function(res){
        that.setData({
          'userDetail.address':res.address,
          'userDetail.latitude':res.latitude,
          'userDetail.longitude':res.longitude,
        })
      }
    })
  },
  
})