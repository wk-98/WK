// miniprogram/pages/tabmy/myconcern.js

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

   userInfo:[]
  },

  onLoad: function (options) {
    if(JSON.stringify(app.globalData.userInfo)!="{}"){
        this.check(); 
    }else{
      wx.showToast({
        title: '请先登录',
      })
    }
  
    
   },

   //获取关注人的用户信息
  check:function(){
    let this1 = this
    wx.cloud.callFunction({
     // 云函数名称
     name: 'check',
    data:{
      a:this.data.B_openid
    },
     success: function(res) {
       //console.log("sfdv",res) 
       //获取关注人数组中的用户信息数组
       let user = []
      for(let i =0 ;i < res.result.a.length; i++){
        user[i] =  res.result.a[i].userInfo
        //this1.data.userInfo[i] = res.result.a[i].userInfo
      } 
      this1.setData({
          userInfo : user
        })
      console.log(this1.data.userInfo)
     
     },
     fail: console.error
   })
  },

    // ListTouch触摸开始
    ListTouchStart(e) {
      this.setData({
        ListTouchStart: e.touches[0].pageX
      })
    },
  
    // ListTouch计算方向
    ListTouchMove(e) {
      this.setData({
        ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
      })
    },
  
    // ListTouch计算滚动
    ListTouchEnd(e) {
      if (this.data.ListTouchDirection =='left'){
        this.setData({
          modalName: e.currentTarget.dataset.target
        })
      } else {
        this.setData({
          modalName: null
        })
      }
      this.setData({
        ListTouchDirection: null
      })
    },
 

})