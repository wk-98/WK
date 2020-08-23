// pages/todoinfo/todoinfo.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    task:null
    // str1:String='ssss'
  },
  pagedata:{

    
  },

 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     console.log(options.id)
      // console.log(options.id)
      db.collection('cn').doc(options.id).get().then(res => {
        
        this.setData({
          task:res.data
        })
      })
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

  },

  onCounterInc: function() {
    const newCount = this.data.task.likes + 1
    console.log(this.data.task._id) 
    var s='task.likes'
    db.collection('cn').doc(this.data.task._id).update({ 
      data: {
        // 表示将 done 字段置为 true
        likes:newCount
      }, success: res => {
        this.setData({
          [s]: newCount
        })}
    })
    .then(console.log)
    .catch(console.error)
  }
  
})