// 自己服务器的地址
var API_URL = "https://boss.raydonet.com/index.php/Admin/Wx/verificationUser";
// 微信提供的接口地址
var HTTP_URL = "https://api.weixin.qq.com/sns/jscode2session?appid=appid&secret=app_sectet&grant_type=authorization_code&js_code=code";
var app = getApp();
Page({
  data: 
  {
    items:  {},
    gid:null
  },
  onLoad: function (options) 
  {
    var that = this
    var gid = options.gid// 联系人ID
    var uid = wx.getStorageSync('uid')
    wx.request({
      url: 'https://boss.raydonet.com/index.php/Admin/Wx/searchContactUser',
      data:{gid:gid,uid:uid},
      headers: {'Content-Type': 'application/json'},
      method:'GET',
      success: function (res) 
      {
        if(res.data.flag === 2)
        {
          wx.switchTab({
            url: '../index/index'
          })
        }else
        {
          var name = that.data.items.username
          wx.setNavigationBarTitle({
            title: res.data.username+'的名片' 
          })
          that.setData({
            items: res.data,
            gid:gid
          })
        }
      }
    })
    if(!uid){
      wx.login({//login流程
        success: function (res) {//登录成功
          var code = res.code;
          wx.getUserInfo({
            //getUserInfo流程
            success: function (res2) {
              var username = res2.userInfo.nickName
              var img = res2.userInfo.avatarUrl
              //请求自己的服务器
              wx.request({
                url:HTTP_URL,
                data:{
                  js_code:code,
                  appid:'wx915858fff3df4915',
                  secret:'34d91830ed69bd10ea15dd94ef662222',
                  grant_type:'authorization_code'
                },
                method:'GET',
                header:{'content-type': 'application/json'},
                success: function (a) {
                  var openid = a.data.openid
                  // 请求自己的服务器
                  wx.request({
                    url:API_URL,
                    data:{
                      openid:openid,
                      username:username,
                      img:img
                    },
                    success: function(b){
                      // 成功返回用户的唯一ID(这是数据库ID)
                      wx.setStorageSync('uid', b.data.uid)
                      var uid = b.data.uid
                      wx.request({
                        url: 'https://boss.raydonet.com/index.php/Admin/Wx/searchContactUser',
                        data:{gid:gid,uid:uid},
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        method:'GET',
                        success: function (res) {
                          if(res.data.flag === 2){
                            wx.switchTab({
                              url: '../index/index'
                            })
                          }else{
                            var name = that.data.items.username
                            wx.setNavigationBarTitle({
                              title: res.data.username+'的名片' 
                            })
                            that.setData({
                              items: res.data,
                              gid:gid
                            })
                          }
                        }
                      })                                                        
                    }
                  })
                },
                fail: function () {
                  // fail
                  wx.showToast({
                    title: '网站正在维护中...',
                    icon: 'loading',
                    duration: 10000
                  });
                }
              })
            },
            fail:function(){
              wx.request({
                url: 'https://boss.raydonet.com/index.php/Admin/Wx/searchContactUser',
                data:{gid:gid,uid:uid},
                headers: {
                  'Content-Type': 'application/json'
                },
                method:'GET',
                success: function (res) {
                  if(res.data.flag === 2){
                    wx.switchTab({
                      url: '../index/index'
                    })
                  }else{
                    var name = that.data.items.username
                    wx.setNavigationBarTitle({
                      title: res.data.username+'的名片' 
                    })
                    that.setData({
                      items: res.data,
                      gid:gid
                    })
                  }
                }
              })
            },
            complete:function()
            {
               wx.showToast({
                title: '正在登录...',
                icon: 'loading',
                duration: 6000
              })
            }
          })
        }
      })
    }else{  
      wx.request({
        url: 'https://boss.raydonet.com/index.php/Admin/Wx/searchContactUser',
        data:{gid:gid,uid:uid},
        headers: {
          'Content-Type': 'application/json'
        },
        method:'GET',
        success: function (res) {
          if(res.data.flag === 2){
            wx.switchTab({
              url: '../index/index'
            })
          }else{
            var name = that.data.items.username
            wx.setNavigationBarTitle({
              title: res.data.username+'的名片' 
            })
            that.setData({
              items: res.data,
              gid:gid
            })
          }
        }
      })
    }               
  },
  coll: function () {
    var that = this
    var gid = that.data.items.id
    var coll = that.data.items.is_coll
    var uid = wx.getStorageSync('uid')
    if(uid){
      wx.request({
        url:'https://boss.raydonet.com/index.php/Admin/Wx/collOrLikeUser',
        data:{uid:uid,gid:gid,coll:coll,type:1},
        method:'GET',
        success: function (res) {
          that.setData({
            items: res.data
          })
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '您好,您还没有对此程序进行授权,不能对该用户进行收藏如有不便之处,敬请谅解'
      })
    }
  },
  onPullDownRefresh: function(){
    wx.stopPullDownRefresh()
  },
  likes: function () {
    var that = this
    var gid = that.data.items.id
    var likes = that.data.items.is_like
    var uid = wx.getStorageSync('uid')
    if(uid){
      wx.request({
        url:'https://boss.raydonet.com/index.php/Admin/Wx/collOrLikeUser',
        data:{uid:uid,gid:gid,likes:likes,type:2},
        method:'GET',
        success: function (res) {
            that.setData({
              items: res.data
          })
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '您好,您还没有对此程序进行授权,不能对该用户进行点赞如有不便之处,敬请谅解'
      })
    }
  },
  collCard: function () {
    wx.switchTab({
      url: '../index/index'
    })
  },
  // 联系客服
  lianxikefu:function(){
    wx.makePhoneCall({
      phoneNumber: '010-56170950'
    })
  },
  onShareAppMessage: function () {
    var that = this
    var gid = that.data.gid
    return {
      title: '分享你一个名片，请多多指教',
      path: '/pages/contactUser/contactUser?gid='+gid
    }
  },
  // 打电话
  cphone: function (event) {
    // console.log(event)
    wx.makePhoneCall({
      phoneNumber: event.target.id
    })
  }
})
