// miniprogram/pages/index/my.js

Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl:"",
    userInfo: {},
    logged:false,
    show: true
  },
  

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const app = getApp();
     // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']&&!app.globalData._openid) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          this.onGetOpenid()
          wx.getUserInfo({
            success: res => {
              
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo,
                logged:true
              })
            }
          })
        }
      }
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('我的')
    this.getTabBar().init();
  },

  onGetuserInfo(e){
   
    console.log(e)
    if (!this.data.logged && e.detail.userInfo) {
      this.data.logged=true;
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
       // 调用云函数获取openid,并通过wx.getUserInfo({})获取用户信息
     this.onGetOpenid()
    
  },
  onGetOpenid: function() {
    const app = getApp();
    // 调用云函数获取openid,并通过wx.getUserInfo({})获取用户信息
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user : ', res)
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  navigateTomyupdate(){
    const app = getApp();
    console.log("dsc",app.globalData.openid)
    wx.navigateTo({
      url:'../tabmy/myupdate?_openid='+app.globalData.openid
    })
  },
  navigateTomycollect(){
    wx.navigateTo({
      url:'../tabmy/mycollect'
    })
  },
  navigateTomyconcern(){
    wx.navigateTo({
      url:'../tabmy/myconcern'
    })
  },
  handleTap: function() {
    this.setData({
      show: false
    })
  },
  handleTap1: function() {
    this.setData({
      show: true
    })
  }
})