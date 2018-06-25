var app = getApp();
// 幻灯
function hd(that){
  wx.request({
    url: app.d.API_URL + '/Api/index/hd_pic',
    method: 'post',
    header: { 'Content-Type': 'application/x-www-form-urlencoded' },
    success: function (b) {
      that.setData({
        banner: b.data.ggtop,
        banner_pic: b.data.pic
      })
    }
    
    })
}
// 分享文字 信息
function shareinfo (that){
  wx.request({
    url: app.d.API_URL + '/Api/index/shareinfo',
    method:'post',
    header:{'content-Type':'application/x-www-form-urlencoded'},
    success:function(res){
      that.setData({
        shareb:res.data.shareb,
        sharea:res.data.sharea
      })
    }
  })
}




module.exports = {
  hdpic: hd,
  shareinfo:shareinfo
}
