var hd = require('../../utils/hd.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: [{ link: '', pic: '' }],
    showallDisplay:'block',
    postsList:[{title:'测试'}],
    floatDisplay: "none",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   // var res = hd.hdpic();
    var that = this;
    hd.hdpic(that);  //加载幻灯数据
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
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var gid = wx.getStorageSync('uid')
    return {
      title: '这是我的名人卡,以后请指教',
      path: '/pages/contactUser/contactUser?gid=' + gid
    }
  },
  // 跳转至查看文章详情
  redictDetail: function (e) {
    // console.log('查看文章');
    var id = e.currentTarget.id,
      url = '../detail/detail?id=' + id;
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

  },
  // 收藏我的
  cmy:function (e) {

  },
})