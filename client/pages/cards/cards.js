var hd = require('../../utils/hd.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: [{ link: '', pic: '' }],
    showallDisplay:'block',
    postsList: null,
    floatDisplay: "none",
    typeid:2, //默认我的收藏 2
    page: 1,  //当前页数 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   // var res = hd.hdpic();
    var that = this;
    hd.hdpic(that);  //加载幻灯数据
    // 获取我的收藏信息
    that.postlist(2);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    // 获取分享文字信息
    hd.shareinfo(that);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (!that.data.endpage) {
      page: that.data.page++
      that.postlist(that.data.typeid)
      console.log('下拉');
    }else{
      wx.showToast({
        title: '已是最后一页',
        icon: 'warn',
        duration: 1500,
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    var gid = wx.getStorageSync('uid')
    console.log(that.data.shareb + that.data.sharea)
    return {
      title: that.data.shareb + wx.getStorageSync('username') + that.data.sharea,
      path: '/pages/contactUser/contactUser?gid=' + gid
    }
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

  //  预览图片
  previewImage: function (e) {
    var that = this;
    var current = e.currentTarget.dataset.src;  
    wx.previewImage({
      current: current,// 当前显示图片的http链接 
      urls: that.data.banner_pic // 需要预览的图片http链接列表  
    })
  },

  // 修改名片
  mody: function(e){
    var uid = wx.getStorageSync('uid')
    wx.navigateTo({
      url: '../ucard/ucard?uid=' + uid
    })
  },

  // 我的收藏
  myc:function(e){
    this.postlist(2);
    this.setData({
      typeid:2
    })
  },
  // 收藏我的
  cmy:function (e) {
    this.postlist(1);
    this.setData({
      typeid:1
    })
  },
  // 信息列表
  postlist: function (typeid){
    var that = this;
    var postsList = that.data.postsList;
    var uid = wx.getStorageSync('uid')    
    wx.request({
      url: app.d.API_URL + '/Api/User/mycolle',
      data: { 
        uid: uid,
        type: typeid,
        page:that.data.page
      },
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      success: function (res) {
        //console.log(res);
        if (wx.getStorageSync('typeid') != typeid){
          postsList=null
          wx.setStorageSync('typeid', typeid)
          console.log(' postsList=null')
        }
        if (postsList == null) {
          postsList =res.data.list
        }else{
          postsList = postsList.concat(res.data.list)
        }
        that.setData({
          postsList: postsList,
          endpage:res.data.endpage,
          num:res.data.num,
        })
      }
    })
  },
})