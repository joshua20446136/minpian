//app.js
App({
  d: {
    // 自己服务器的地址
    //API_URL:"https://tqynewn1.qcloud.la/?s=",
    API_URL:"https://mp.wenmo8.com/index.php",
    userId: 1,
    appId: "",
    appKey: "",
  },
  
  onLaunch: function () {
    console.log('App_onLaunch')
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    //login
    this.getUserInfo();
    console.log('getUserInfo11');
  },
  getUserInfo: function (cb) {
    console.log('getUserInfo');
    var that = this
    console.log('this.globalData.userInfo' + that.globalData.userInfo)
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
        wx.login({//login流程
          success: function (res) {//登录成功
            if (res.code) {
              var code = res.code;
              wx.getUserInfo({
                //getUserInfo流程
                success: function (res2) {
                  // console.log(res2)
                  that.globalData.userInfo = res2.userInfo
                  console.log('this.globalData.userInfo' + that.globalData.userInfo)
                  typeof cb == "function" && cb(that.globalData.userInfo)
                  //请求自己的服务器
                  that.getsessionkey(code);
                }
              })
            } else {
              wx.showModal({
                title: '提示',
                content: '获取用户登录态失败！'+res.errMsg
              })
            }
          }
        })
    }
  },
  getsessionkey:function(code) {
    console.log('getsessionkey');
    var that = this
  wx.request({
      url: that.d.API_URL + '/Api/Login/getsessionkey',
      method: 'post',
      data: {
        code: code
      },
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        var data = res.data;
        var title_err = res.err;
        if (data.status == 0) {
          wx.showToast({
            title: title_err,
            duration: 2000
          });
          return false;
        }

        that.globalData.userInfo['sessionId'] = data.session_key;
        that.globalData.userInfo['openid'] = data.openid;
        that.onLoginUser(); 
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！err:getsessionkeys',
          icon: 'loading',
          duration: 10000
        });
      }
    })
  }
  ,
  onLoginUser: function () {
    console.log('sd')
    var that = this;
    var user = that.globalData.userInfo;
    wx.request({
      url: that.d.API_URL + '/Api/Login/authlogin',
      method: 'post',
      data: {
        SessionId: user.sessionId,
        gender: user.gender,
        NickName: user.nickName,
        HeadUrl: user.avatarUrl,
        openid: user.openid
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data    
          
       
        var status = res.data.status;
        var title_err = '';
        if (status ==0) {
          title_err = res.data.err;
          wx.showToast({
            title: title_err,
            duration: 3000
          });
          return false;
        }

        that.globalData.userInfo['id'] = res.data.arr.ID;
        that.globalData.userInfo['NickName'] = res.data.arr.NickName;
        that.globalData.userInfo['HeadUrl'] = res.data.arr.HeadUrl;
        var userId = res.data.arr.ID;
        if (!userId) {
          wx.showToast({
            title: '登录失败！',
            duration: 3000
          });
          return false;
        }

        that.d.userId = userId;
        try{
          wx.setStorageSync('uid', userId);
          console.info('getstorageSync'+wx.getStorageSync('uid'))
        }catch(e){
          console.info(e);
        }
        
        
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！err:authlogin',
          duration: 2000
        });
      },
    });
    
  },
  getOrBindTelPhone: function (returnUrl) {
    console.log('getOrBindTelPhone')
    var user = this.globalData.userInfo;
    if (!user.tel) {
      wx.navigateTo({
        url: 'pages/binding/binding'
      });
    }
  },

  globalData:{
    userInfo:null
  }
})