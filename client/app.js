//app.js
App({
  d: {
    // 自己服务器的地址
    //API_URL:"https://tqynewn1.qcloud.la/?s=",
    API_URL:"https://mp.toudian.net/index.php",
    userId: 0,
  },
  
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    //login
   
    this.getUserInfo();
  },
  getUserInfo: function (cb) {    
    var that = this;
    if (this.globalData.userInfo) {
      console.log('getUserInfo11');
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
        wx.login({//login流程
          success: function (res) {//登录成功
            if (res.code) {
              var code = res.code;
              that.d.code = code;
             // wx.getUserInfo({
                //getUserInfo流程
            //    success: function (res2) {
             //      console.log(res2)
             //     that.globalData.userInfo = res2.userInfo
              //    typeof cb == "function" && cb(that.globalData.userInfo)     
                  //请求自己的服务器
                  that.getsessionkey(code);
              //  }
              //})
            } else {
              wx.showModal({
                title: '提示',
                content: '获取用户登录态失败！'+res.errMsg
              })
            }
          },
          fail: function (e) {
            console.log(e)
          }
        })
    }
  },
  getsessionkey: function (code) {
    var that = this
  wx.request({
      url: that.d.API_URL + '/Api/Login/getsessionkey',
      method: 'post',
      data: {
        code: code
      },
      dataType:'json',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      //header: { 'Content-Type': 'application/json' },
      
      success: function (res) {
       // console.log(res.data.session_key);
        var data = res.data;
        var title_err = res.err;
        if (data.status == 0) {
          wx.showToast({
            title: title_err,
            duration: 2000
          });
          return false;
        }
        //that.globalData.userInfo['sessionId'] = data.session_key;
      //  that.globalData.userInfo['openid'] = data.openid;
        wx.setStorageSync('session_key', data.session_key);
        wx.setStorageSync('openid', data.openid);
        var s_key = wx.getStorageSync('session_key')
        console.log('sess_openid', s_key );
       // that.onLoginUser(); 
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
  onLoginUser: function (e) {
   // console.log('App_onLoginUser');
    var that = this;
    console.log(e)
    that.globalData.userInfo = e
    // that.globalData.userInfo['sessionId'] = wx.getStorageSync('session_key')
    // that.globalData.userInfo['openid'] = wx.getStorageSync('openid')
    var user = that.globalData.userInfo;
    console.log('user')
    console.log(user)
    console.log('user')
    wx.request({
      url: that.d.API_URL + '/Api/Login/authlogin',
      method: 'POST',
      data: {
        sessionId: user.sessionId,
        gender: user.gender,
        nickname: user.nickName,
        headurl: user.avatarUrl,
        openid: user.openid
      },
      dataType: 'json',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {       
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
        wx.hideLoading()
        //console.log(res);
        //console.log(res.data.arr.uid);
        that.globalData.userInfo['id'] = res.data.arr.uid;
        that.globalData.userInfo['nickname'] = res.data.arr.nickname;
        that.globalData.userInfo['headurl'] = res.data.arr.headurl;
        
        var userId = res.data.arr.uid;
        if (that.userInfoReadyCallback) {
          that.userInfoReadyCallback(userId)
        }
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
         // console.info('getstorageSync'+wx.getStorageSync('uid'))
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
  },



})