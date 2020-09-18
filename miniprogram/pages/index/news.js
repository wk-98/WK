// miniprogram/pages/index/news.js
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    message : []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideTabBarRedDot({index:3})
    app.flag3 = false
    this.setData({
      message : app.globalData.message
    })
   // this.data.message = app.globalData.message
   console.log(this.data.message[0])
     console.log(this.data.message[0].content)
    // for(let i = 0; i < this.data.message.length; i++){
    //   console.log("huoqu",this.data.message[i].B_openid)
    // }
    

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
   
    wx.hideTabBarRedDot({index:3})
    app.flag3 = false
    this.setData({
      message : app.globalData.message
    })
    //将已经读取了的消息状态置为1
    for(let i = 0; i < this.data.message.length; i++){
      console.log("huoqu",this.data.message[i])
      db.collection('message').doc(this.data.message[i]._id).update({
        data:{
          status:1
        }
      }).then(res=>{
        wx.hideTabBarRedDot({index:3})
        console.log("状态置1")
      })
    }
  },

  onClick:function(event) {
   //点击顶部tarbar的响应事件
   
  }
  
  
})