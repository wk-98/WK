// pages/todoinfo/todoinfo.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    task:null,
    com:null,
    avatarUrl1:null,
    userInfo1:null

  },
  pagedata:{

    
  },

  getComment:function(){

    db.collection('comment').where({
      _id2: this.data.task._id
    })
    .get().then(res => {
      
      this.setData({
        com:res.data
      })
    })

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
      }),
      db.collection('comment').where({
        _id2: options.id
      })
      .get().then(res => {
        
        this.setData({
          com:res.data
        })
      }),
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                this.setData({
                  avatarUrl1: res.userInfo.avatarUrl,
                  userInfo1: res.userInfo
                })
              }
            })
          }
        }
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
  },
  onComment:function(event){

      console.log(event.detail.value.comment)
      // console.log(this.data.userInfo1)
      // console.log(this.data.avatarUrl1)
      const todos =db.collection('comment')
      todos.add({data:{
        _id2:this.data.task._id,
        content:event.detail.value.comment,
        userInfo2:this.data.task.userInfo,
        userInfo1:this.data.userInfo1,
        avatarUrl1:this.data.avatarUrl2

      }
      }).then(res =>{
        console.log("添加成功")
        wx.showToast({
          title: '评论成功',
        })
        this.getComment()
      })
  

  }
 
  
})