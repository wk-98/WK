// miniprogram/pages/index/news.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    comment_time:null

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
   
  },

  onClick:function(event) {
    console.log(event)
    wx.showToast({
      title: `点击标签 ${event.detail.name}`,
      icon: 'none',
    });
  }
  // demo(){

  //   wx.cloud.callFunction({
  //     name: 'LoadData',
  //     success: res => {
       
  //       console.log("返回发布动态数组:",res.result.data)
  //       // this.setData({

          
  //       //   comment_time:res.result.tim
          
  //       // })

  //         // console.log(this.data.comment_time)

  //     },
  //     fail: err => {
  //       console.error('[云函数] [时间函数] 调用失败：', err)
  //     }
  //   })
  // }

  
})