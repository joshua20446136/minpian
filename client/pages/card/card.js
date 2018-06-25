// pages/card/card.js
var hd = require('../../utils/hd.js');
var app = getApp()
Page({
  data:{
    postsList:[],          // 用户联系人信息
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
    lengs:0,
    banner: [{ link: '', pic: '' }],
    index:0,
    index1:0,
    index2:0,
    array:[],
    array1:[''],
    array2:[],
    page:1,  //当前页数 
    city: '', // 地区
    industry: '', //行业
    position:'', //职业
    search:'',  //搜索关键字
  },

  // 页面初始化
  onLoad:function(options){
    var that = this
    hd.hdpic(that);  //加载幻灯数据
    // 获取地区
    that.get_province()
    that.get_industry()
    that.get_position()
    that.cardlist()
    
  },
    // 上拉
    onPullDownRefresh: function(){
      var that = this;
      that.onLoad();
      wx.showToast({ title: '刷新数据完成', }) 
      wx.stopPullDownRefresh()
    },
    // 下拉
    onReachBottom: function() {
      var that = this;    
      if(!that.data.endpage){
        page: that.data.page++
        that.cardlist()
        console.log('下拉');   
      }else{
        wx.showToast({
          title: '已是最后一页',
          icon: 'warn',
          duration: 1500,
        })
      } 
   
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
 
  },
  /*** 预览图片****/
  previewImage: function (e) {
    var that = this;
    var current = e.currentTarget.dataset.src;
    wx.previewImage({
      current: current,// 当前显示图片的http链接 
      urls: that.data.banner_pic // 需要预览的图片http链接列表  
    })
  },
  select: function (e) {
    console.log('select',e)
    var that = this
    that.data.search = e.detail.value
    that.data.page = 1
    that.data.postsList = []
    that.cardlist()
  },
  //获取名片列表信息
  cardlist:function(){
    var that = this;
    var postsList = that.data.postsList ;
    var lengs = that.data.lengs;
    wx.request({
      url: app.d.API_URL + '/api/user/alluser',
      data: { 
        page: that.data.page, 
        search: that.data.search,
        city: that.data.city, // 地区
        industry: that.data.industry, //行业
        position: that.data.position, //职业
      },
      method: 'GET',
      success: function (res) {
        // console.log(res);
     
        // if (postsList.length == 0) {
        //   postsList = res.data.userall
        // } else {
        //   postsList.concat(res.data.userall)
        //   console.log('res.data.userall', res.data.userall)
        //   console.log(postsList)
        // }
        
        
        that.setData({
          postsList: postsList.concat(res.data.userall),
          lengs: lengs + res.data.userall.length,
          endpage: res.data.endpage,
        })
      }
    })
  },
  // 跳转至查看文章详情
  redictDetail: function (e) {
    // console.log('查看文章');
    var id = e.currentTarget.id,
      url = '../contactUser/contactUser?gid=' + id;
    wx.navigateTo({
      url: url
    })
  }, 
  // 地区
  get_province:function(){
    var that = this
    wx.request({
      url: app.d.API_URL + '/Api/Address/get_province',
      data: {},
      method: 'POST',
      success: function (res) {
        var status = res.data.status;
        var province = res.data.list;
        var sArr = [];
        var sId = [];
        sArr.push('地区');
        sId.push('0');
        for (var i = 0; i < province.length; i++) {
          sArr.push(province[i].name);
          sId.push(province[i].id);
        }
        that.setData({
          array: sArr,
          shengId: sId
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
  // 行业
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
           array1: sArr.concat(res.data.list),          
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
  // 职业
  get_position: function () {
    var that = this
    wx.request({
      url: app.d.API_URL + '/Api/Category/getposition',
      data: {},
      method: 'POST',
      success: function (res) {
        var status = res.data.status;
        var sArr = [];
        sArr.push('职业');
        that.setData({
          array2: sArr.concat(res.data.list),
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
  // 地区转换
  bindPickerChange:function(e){
    var that = this
    console.log(that.data.array[e.detail.value])
    this.setData({
      index: e.detail.value,
      city:that.data.array[e.detail.value]
    })
    //从新获取
    that.data.page = 1
    that.data.postsList = []
    that.cardlist()
  },
  // 地区转换
  bindPickerChange1: function (e) {
    var that = this
    console.log(that.data.array1[e.detail.value])
    this.setData({
      index1: e.detail.value,
      industry: that.data.array1[e.detail.value]
    })
    //从新获取
    that.data.page = 1
    that.data.postsList = []
    that.cardlist()
  },  // 地区转换
  bindPickerChange2: function (e) {
    var that = this
    console.log(that.data.array2[e.detail.value])
    this.setData({
      index2: e.detail.value,
      position: that.data.array2[e.detail.value]
    })
    //从新获取
    that.data.page = 1
    that.data.postsList = []
    that.cardlist()
  }
  
})