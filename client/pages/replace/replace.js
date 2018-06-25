// pages/replace/replace.js
Page({
  data:{
    userInfo:{},
    yanzhen:true,
    phone:null,
    status:1,
    code:null
  },
  // 页面初始化
  onLoad:function(options){
    var that = this
    wx.getUserInfo({
      success:function(res){
        //更新数据
        that.setData({
          userInfo:res.userInfo
        })
      }
    })
  },
  // 这是按钮的长度
  inputPhone: function (e) {
    var that = this
    var phone = e.detail.value
    var leng = e.detail.value.length
    if(leng > 10){
      that.setData({
        yanzhen:false,   // 按钮
        phone:phone      // 手机号
      })
    }else{
      that.setData({
        yanzhen:true
      })
    }
  },
  // 这是验证手机
  checkPhone: function () {
    var that = this
    var username = that.data.userInfo.nickName
    var phone = that.data.phone
    wx.request({
      url: 'https://boss.raydonet.com/index.php/Admin/Wx/checkPhone',
      data: {username:username,phone:phone},
      method: 'GET',
      success: function(res){
        // 成功
        console.log(res)
        that.setData({yanzhen:true,code:res.data.code})
        setTimeout(function(){
          that.setData({
            yanzhen:false
          })
        },1000)
        wx.showToast({
          title: '短信已发送至您的手机,请注意查收',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  // 这是表单验证
  formSubmit: function (e) {
    var that = this
    var status = that.data.status
    var uid = wx.getStorageSync('uid')
    var phone = e.detail.value.phone
    console.log(status)
    if(status === 2){
      wx.request({
        url: 'https://boss.raydonet.com/index.php/Admin/Wx/formSubmit',
        data: {uid:uid,phone:phone},
        method: 'GET',
        success: function(res){
          // success
          console.log(res)
          if(res.data.flag === 1){
            wx.switchTab({
              url: '../index/index'
            })
          }else{
            wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 2000
          })
          }
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '请输入正确的验证码'
      })
    }
  },
  inputCode:function(e){
    var that = this
    var code = that.data.code
    var codes = e.detail.value
    if(codes == code){
      that.setData({status:2})
    }
  },
  onPullDownRefresh: function(){
    wx.stopPullDownRefresh()
  },
})