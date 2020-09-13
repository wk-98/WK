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
    this.check(); 
    
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
       
      for(var i =0 ;i < res.result.a.length; i++){
        this1.data.userInfo[i] = res.result.a[i].userInfo
      }
      console.log(this1.data.userInfo)
     
     },
     fail: console.error
   })
  },
 

})