// pages/card/card.js
var hd = require('../../utils/hd.js');
var app = getApp()
Page({
  data:{
    items:[],          // 用户联系人信息
    showsort:'none',   // 这是排序
    tops:'none',       // 这是搜索
    top:'block',       // 这是一级分类
    focus:false,       // 这是焦点
    values:null,       // 这是搜索的初始化
    name:'按姓名',      // 这是一级分类的标题
    srcbottom1:'block', // 这是按姓名排序
    srcbottom2:'none',  // 这是按时间排序
    srcbottom3:'none',  // 这是按公司排序
    sortUrl:'paixu',     // 这是排序图片
    lengs:'0',
    banner: [{ link: '', pic: '' }],
    index:0,
    index1:0,
    index2:0,
    array:['地区'],
    array1:['行业'],
    array1:['职位']
  },
  // 页面初始化
  onLoad:function(options){
    var that = this
    hd.hdpic(that);  //加载幻灯数据
    var uid = wx.getStorageSync('uid')
    wx.request({
      url:"https://boss.raydonet.com/index.php/Admin/Wx/searchUser",
      data:{uid:uid},
      method:'GET',
      success: function (res) {
        that.setData({
          items:res.data,
          lengs:res.data.length
        })
      }
    })
  },
  // 一级分类事件(排序的隐藏与显示)
  tapMainMenu:function (e){
    if(this.data.showsort === 'none'){
      this.setData({showsort:"block"})
    }else{
      this.setData({showsort:"none"})
    }
  },
  // 一级分类事件搜索(点击触发其他事件隐藏,此事件为优先)
  tapMainSou:function(){
    this.setData({tops:"block",top:"none",focus:true,values:null,showsort:'none'})
  },
  // 取消时触发的ajax请求全部数据
  tapQuXiao:function(){
    var that = this
    this.setData({tops:"none",top:"block"})
    var uid = wx.getStorageSync('uid')
    console.log(uid)
    wx.request({
      url:"https://boss.raydonet.com/index.php/Admin/Wx/searchUser",
      data:{uid:uid},
      method:'GET',
      success: function (b){
        that.setData({
          items:b.data
        })
      }
    })
  },
  select:function (e){
    var that = this
    var where = e.detail.value
    var uid = wx.getStorageSync('uid')
    wx.request({
      url:"https://boss.raydonet.com/index.php/Admin/Wx/searchUser",
      data:{uid:uid,where:where},
      method:'GET',
      success: function (b){
        that.setData({
          items:b.data
        })
      }
    })
  },
  tapSubMenu1:function(){
    var that = this
    var uid = wx.getStorageSync('uid')
    wx.request({
      url:"https://boss.raydonet.com/index.php/Admin/Wx/searchUser",
      data:{uid:uid,sort:'username'},
      method:'GET',
      success: function (b){
        that.setData({
          items:b.data,
          showsort:'none',
          srcbottom1:'block',
          srcbottom2:'none',
          srcbottom3:'none',
          name:'按姓名',
          sortUrl:'paixu'
        })
      }
    })
  },
  tapSubMenu2:function(){
    var that = this
    var uid = wx.getStorageSync('uid')
    wx.request({
      url:"https://boss.raydonet.com/index.php/Admin/Wx/searchUser",
      data:{uid:uid,sort:'atime'},
      method:'GET',
      success: function (b){
        that.setData({
          items:b.data,
          showsort:'none',
          srcbottom1:'none',
          srcbottom2:'block',
          srcbottom3:'none',
          name:'按时间',
          sortUrl:'shijian'
        })
      }
    })
  },
  tapSubMenu3:function(){
    var that = this
    var uid = wx.getStorageSync('uid')
    wx.request({
      url:"https://boss.raydonet.com/index.php/Admin/Wx/searchUser",
      data:{uid:uid,sort:'company'},
      method:'GET',
      success: function (b){
        that.setData({
          items:b.data,
          showsort:'none',
          srcbottom1:'none',
          srcbottom2:'none',
          srcbottom3:'block',
          name:'按公司',
          sortUrl:'gongsi'
        })
      }
    })
  },
  onPullDownRefresh: function(){
    wx.stopPullDownRefresh()
  },
  callPhone:function(event){
    console.log(event)
    wx.makePhoneCall({
      phoneNumber: event.target.id
    })
  },
  // 页面显示
  onShow:function(){
    var that = this
    var uid = wx.getStorageSync('uid')
    // 页面初始化 options为页面跳转所带来的参数
    wx.request({
      url:"https://boss.raydonet.com/index.php/Admin/Wx/searchUser",
      data:{uid:uid},
      method:'GET',
      success: function (res) {
        that.setData({
          items:res.data,
        })
      }
    })
  },
  /*** 预览图片****/
  previewImage: function (e) {
    var that = this;
    var current = e.currentTarget.dataset.src;
    wx.previewImage({
      current: current,// 当前显示图片的http链接 
      urls: that.data.banner_pic // 需要预览的图片http链接列表  
    })
  }
})