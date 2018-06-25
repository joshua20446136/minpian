// pages/addCard/addCard.js
var app = getApp();
Page({
  data:{
    nickName:null,  // 用户的昵称
    avatarUrl:null, // 用户的头像
    yanzhen:true,   // 验证按钮(true为开启禁用,false为关闭禁用)
    showSend:'none',// 验证标签(none为不显示,block为显示)
    code:null,      // 验证码(验证成功后返回验证码)
    phone:null,     // 这是用户输入的手机号
    status:null,    // 验证状态(null为未验证,1为验证)
    img:null,
    date:[],
    index:0,
    array:[]
    },
  // 页面初始化
  onLoad:function(){
    var that = this
    that.get_industry()
    //调用应用实例的方法获取全局数据
    wx.getUserInfo({
      success:function(res){
        //更新数据
        that.setData({
          userInfo:res.userInfo
        })
      }
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  // 这是创建的表单提交
  formSubmit: function(e) {
    var that = this
    var uid = wx.getStorageSync('uid')
    var status = that.data.status
    if (!e.detail.value.username || !e.detail.value.company ){
      wx.showModal({
        title: '提示',
        content: '请您完善信息后再提交'
      })
      return;
    }
    // 判断当前用户是否验证
    if(status === 1){
      wx.request({
        url: app.d.API_URL + '/Api/User/addcard',
        data:{
          type:1,
          username:e.detail.value.username,
          wxname: e.detail.value.wxname,
          company:e.detail.value.company,
          position:e.detail.value.position,
          email:e.detail.value.email,
          detailInfo:e.detail.value.detailInfo,
          phone:e.detail.value.phone,
          industry: e.detail.value.industry,
          uid:uid,
          openid: app.globalData.userInfo['openid']
        },
        method:'POST',
        header: { 'content-type': 'application/x-www-form-urlencoded'},
        success: function (str) {
          if(str.data.status === 1){
            wx.switchTab({
              url: '../index/index'
            })
          }else{
            wx.showToast({
              title: str.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '请您点击获取微信绑定手机号后再提交'
      })
    }
  },
  // 获取手机号
  getPhoneNumber: function (e) {
    var that = this;
    var session_key = wx.getStorageSync('session_key')
    wx.request({
      url: app.d.API_URL + '/Api/User/get_mobile',
      data: {
        sessionKey: session_key, //全局变量中的 sessionKey
        encryptedData: e.detail.encryptedData,  //包括敏感数据在内的完整用户信息的加密数据
        iv: e.detail.iv
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
       
        that.setData({
          phone:res.data.phoneNumber,
          status:1,
        })
        // console.log(res.data.purePhoneNumber);
      }
    })
  },
  // 获取行业
  get_industry: function () {
    var that = this
    wx.request({
      url: app.d.API_URL + '/Api/Category/getindustry',
      data: {},
      method: 'POST',
      success: function (res) {
        var status = res.data.status;
        var sArr = [];
        sArr.push('行业');
        that.setData({
          array: sArr.concat(res.data.list),
        })
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
  },

  // 触发按钮和隐藏属性
  sendInfo: function (e) {
    var that = this
    var phone = e.detail.value
    var leng = e.detail.value.length
    if(leng > 10){
      that.setData({
        yanzhen:false,   // 按钮
        showSend:'block',// 验证码
        phone:phone      // 手机号
      })
    }
  },
  // 按钮提交
  btnValidation: function () {  
    var that = this
    var phone = that.data.phone
    var name  = that.data.userInfo.nickName
    wx.request({
      url:'',
      data:{phone:phone,name:name},
      method:'GET',
      success:function(res){
        wx.showToast({
        title: '短信已发送成功,请注意查收',
        icon: 'success',
        duration: 2000
      })
        var code = res.data.code
        that.setData({
          yanzhen:true,
          code:code
        }),
        setTimeout(function(){
          that.setData({
            yanzhen:false
          })
        },60000)
      }
    })
  },
  inputValidation: function (e) {
    // 短信验证成功的弹窗
    var that = this
    var values = e.detail.value
    var code = that.data.code
    if(values == code){
      that.setData({
        status:1
      })
      wx.showToast({
        title: '验证成功',
        icon: 'success',
        duration: 2000
      })
    }
  }
})