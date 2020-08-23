// miniprogram/pages/index/news.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    console.log('消息')
    this.getTabBar().init();
  },

  onClick:function(event) {
    console.log(event)
    wx.showToast({
      title: `点击标签 ${event.detail.name}`,
      icon: 'none',
    });
  }

  
})