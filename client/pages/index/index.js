// index.js
// 获取应用实例
var hd = require('../../utils/hd.js');
var app = getApp()
Page({
  data: {
    index1:'flex', // 这是初始用户看到的页面
    index3:'none',  //名片编辑
    index2:'flex', // 这是创建用户看到的页面
    userDetail:{}, // 这是创建用户的全部信息
    items:[] ,     // 这是测试用的
    
 
  },
  // 页面加载
  onLoad: function () {
    var that = this
    // 登录
    wx.login({
      success: res => {
        app.globalData.code = res.code
        //取出本地存储用户信息，解决需要每次进入小程序弹框获取用户信息
        app.globalData.userInfo = wx.getStorageSync('userInfo')
        console.log('userInfo', wx.getStorageSync('userInfo'))
        //wx.getuserinfo接口不再支持
        wx.getSetting({
          success: (res) => {
            //判断用户已经授权。不需要弹框
            console.log('getSetting',res)
            if (!res.authSetting['scope.userInfo']) {
              that.setData({
                showModel: true
              })
            } else {//没有授权需要弹框
              that.setData({
                showModel: false
              })
              wx.showLoading({
                title: '加载中...'
              })
              wx.getUserInfo({
                success: function (res) {
                  console.log('getUserInfo',res.userInfo)
                  app.globalData.userInfo = res.userInfo
                  app.globalData.userInfo['sessionId'] = wx.getStorageSync('session_key')
                  app.globalData.userInfo['openid'] = wx.getStorageSync('openid')
                  app.onLoginUser(app.globalData.userInfo)
                }
              })
              
            }
          },
          fail: function () {
            wx.showToast({
              title: '系统提示:网络错误',
              icon: 'warn',
              duration: 1500,
            })
          }
        })
      },
      fail: function () {
        wx.showToast({
          title: '系统提示:网络错误',
          icon: 'warn',
          duration: 1500,
        })
      }
    });
    
    // 缓存读取用户ID

    //app.getsessionkey(app.d.code)
    var uid = wx.getStorageSync('uid');

    wx.showToast({
      title: '正在登录...',
      icon: 'loading',
      duration: 1000
    });
    // 调用应用实例的方法获取全局数据
    // app.getUserInfo(function(userInfo){
    //   // 更新数据     
    //   that.setData({       
    //     userInfo: userInfo
    //   })
    // });
    
  },

  //获取用户信息新接口
  agreeGetUser: function (e) {
    //设置用户信息本地存储
    try {
      wx.setStorageSync('userInfo', e.detail.userInfo)
      // app.globalData.userInfo = e.detail.userInfo
    } catch (e) {
      wx.showToast({
        title: '系统提示:网络错误',
        icon: 'warn',
        duration: 1500,
      })
    }
    wx.showLoading({
      title: '加载中...'
    })
    let that = this
    that.setData({
      showModel: false
    })
    app.globalData.userInfo = e.detail.userInfo
    app.globalData.userInfo['sessionId'] = wx.getStorageSync('session_key')
    app.globalData.userInfo['openid'] = wx.getStorageSync('openid')
    app.onLoginUser(app.globalData.userInfo)
  },




  
  // 页面显示
  onShow: function () {
    //console.log('index_onShow');
    var that = this;
    app.userInfoReadyCallback = res => {
      console.log('callback');
      that.getuserinfo(res);
    }
    var uid = wx.getStorageSync('uid');
    console.log('index_uid' + uid)
    if(uid){
      console.log('index_getuserinfo')
      that.getuserinfo(uid);   
    }  
    // 获取分享文字信息
    hd.shareinfo(that);
    //调用get_userskin
    that.get_userskin();
   
  },
  // 获取skin信息
  get_userskin:function(){
    var that = this
    var uid = wx.getStorageSync('uid')
    wx.request({
      url: app.d.API_URL + '/Api/User/get_userskin',
      method: 'post',
      data: { uid: uid },
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        if (res.data.status === 1) {
          that.setData({
            skinval:res.data.skindata.val,
            skinvalue:res.data.skindata.value_color
          })
        }
      }
    })
  },

  getuserinfo:function(res){
    var that = this;
    // 缓存读取用户ID
    var uid = res
    //console.log('uid' + uid);
    var session_key = wx.getStorageSync('session_key')
    //console.log('session_key' + session_key);
    wx.request({
      url: app.d.API_URL + '/Api/User/userinfo',
      method: 'post',
      data: { uid: uid },
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      success: function (b) {
        // 返回状态(1为用户创建信息完成,其他为空)
        if (b.data.status === 1) {
          that.setData({
            index1: 'none',
            index2: 'flex',
            userDetail: b.data.userinfo
          });
          wx.setStorageSync('username', b.data.userinfo.username);
          //del:2 没有创建过名片，1禁用，0正常     
          if (b.data.userinfo.del == 2) {
            that.setData({
              index1: 'flex'
            })
            wx.showToast({
              title: '您还没有创建过名片！',
              icon: 'none',
              duration: 2000
            });
          } else {
            index3: 'flex'
          }
        } else {
          wx.showToast({
            title: '网络错误，获取信息失败！',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  // 这是分享
  onShareAppMessage: function () {
    var that = this;
    var gid = wx.getStorageSync('uid');
    return {
      title: that.data.shareb + wx.getStorageSync('username')+that.data.sharea,
      path: '/pages/contactUser/contactUser?gid='+gid
    }
  },
  // 事件处理函数
  // 名片码
  resource1: function () {
    var uid = wx.getStorageSync('uid')
    if(!uid){
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
      url: app.d.API_URL +'/api/user/getwxacode',
      method: 'POST',
      data: { info:JSON.stringify(codeModel),gid:uid },
      header: {'content-Type': 'application/x-www-form-urlencoded'},
      success: function (res) {
        res.data;
        wx.previewImage({
          current: res.data.url,// 当前显示图片的http链接 
          urls: [res.data.url] // 需要预览的图片http链接列表  
        })
      }
    })
  },
  resource2: function () {
    wx.showModal({
      showCancel: false,
      icon: 'loading',
      title: '开发中。',
      duration: 2000
    }) 
    return false;
    var uid = wx.getStorageSync('uid')
    wx.navigateTo({
      url: '../resource/resource?types=2&uid='+uid
    })
  },
  // 我的动态
  resource3: function () {
    var uid = wx.getStorageSync('uid')
    wx.navigateTo({
      url: '../dynamic/dynamic?uid='+uid
    })
  },
  // 私人定制
  resource4: function () {
    var uid = wx.getStorageSync('uid')
    wx.navigateTo({
      url: '../skin/privateorder'
    })
  },
  resource5: function () {
    var uid = wx.getStorageSync('uid')
    wx.navigateTo({
      url: '../ucard/ucard?uid=' + uid
    })
  },
  // 跳转到skin 设置页
  skinchange:function(){
    console.log('skin')
    wx.navigateTo({
      url: '../skin/skin',
    })    
  },
  // 这是添加页面
  curls: function () {
    var uid = wx.getStorageSync('uid')
    if(!uid){
      wx.showModal({
        showCancel:false,
        icon:'loading',
        title: '您还没有对此小程序进行授权,请删除此程序,然后进入微信:发现-小程序-搜索“投点名片”',
        duration: 2000
      })
    }else{
      wx.navigateTo({
        url: '../addCard/addCard'
      })
    }
  },
  // 联系客服
  lianxikefu:function(){
    wx.makePhoneCall({
      phoneNumber: '010-'
    })
  },
  onPullDownRefresh: function(){
    wx.stopPullDownRefresh()
  },
  // 打电话
  cphone: function (event) {
     console.log(event)
    wx.makePhoneCall({
      phoneNumber: event.target.id
    })
  },
  //复制微信名
  wxcopy:function(e){
    wx.setClipboardData({
      data: e.target.id,
    })
  },
  //地址导航
  addressdh: function (e) {
    console.log('adddh',e);
    wx.openLocation({
      latitude: Number(e.currentTarget.dataset.latitude),
      longitude: Number(e.currentTarget.dataset.longitude),
      scale: 28
    })
  },
})
