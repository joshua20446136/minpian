// pages/resource/resource.js
Page({
  data:{
    items:null,
    show:'none',
    typename:'sees'
  },
  onLoad:function(options){
    console.log(options)
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    var types = options.types
    var uid = options.uid
    if(types == 1){
      that.setData({typename:'sees',show:'block'})
      wx.setNavigationBarTitle({title: '访客记录' })
    }else if(types == 2){
      that.setData({typename:'likes',show:'block'})
      wx.setNavigationBarTitle({title: '我的人气' })
    }else if(types == 3){
      that.setData({typename:'colls',show:'block'})
      wx.setNavigationBarTitle({title: '我的名气' })
    }
    wx.request({
      url:'https://boss.raydonet.com/index.php/Admin/Wx/resourceType',
      data:{uid:uid,types:types},
      success: function(res){
        console.log(res)
        that.setData({
          items:res.data
        })
      }
    })
  },
  callPhone:function(event){
    console.log(event)
    wx.makePhoneCall({
      phoneNumber: event.target.id
    })
  },
  onPullDownRefresh: function(){
    wx.stopPullDownRefresh()
  }
})