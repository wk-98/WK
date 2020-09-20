// miniprogram/pages/index/my.js
const app = getApp();
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl:"",
    userInfo: {},
    show: true,
    num:'',
    logged:false
  },
  

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   // const app = getApp();
   console.log("这是用户信息",app.globalData)
   if(app.logged == true){
      this.setData({
        userInfo: app.globalData.userInfo,
        avatarUrl: app.globalData.avatarUrl,
        logged:app.logged
      })
   }
    
  //  if(JSON.stringify(app.globalData.userInfo)!="{}"){
  //     this.setData({
  //       userInfo: app.globalData.userInfo,
  //       avatarUrl: app.globalData.avatarUrl,
  //       logged:app.logged
  //     })
  //     this.check()
  //     console.log(app.globalData.userInfo)
  //   }
   
    // wx.getSetting({

    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       this.onGetOpenid()
    //       wx.getUserInfo({
    //         success: res => {
              
    //           this.setData({
    //             avatarUrl: res.userInfo.avatarUrl,
    //             userInfo: res.userInfo,
    //             logged:true
    //           })
    //         }
    //       })
    //     }
    //   }

    // })
   

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('我的')
    // if(app.flag3 == true){
    //   wx.showTabBarRedDot({index : 3})
    //   app.flag3 = false
    // }
  },

  onGetuserInfo(event){
    console.log(event)
    let this1 = this
    if(event.detail.userInfo){
      wx.cloud.callFunction({
            name:'adduser',
            data:{
              userInfo:event.detail.userInfo
            },
            success :res =>{
              console.log("调用云函数成功")
              app.globalData.openid = res.result.openid
              app.globalData.userInfo = event.detail.userInfo
              app.globalData.avatarUrl = event.detail.userInfo.avatarUrl
              app.logged = true
              this1.setData({
                logged:true,
                avatarUrl: event.detail.userInfo.avatarUrl,
                userInfo: event.detail.userInfo
              })
            }
          })
    }
    // if (e.detail.userInfo) {
    //   this.data.logged=true;
    //   this.setData({
    //     logged: true,
    //     avatarUrl: e.detail.userInfo.avatarUrl,
    //     userInfo: e.detail.userInfo
    //   })
    //   app.globalData.avatarUrl = this.data.avatarUrl,
    //   app.globalData.userInfo = this.data.userInfo
    //   this.onGetOpenid()
    // }
    //   wx.cloud.callFunction({
    //     name:'adduser',
    //     success:res=>{
    //       console.log("添加成功")
    //     }
    //   })
  },

  onGetOpenid: function() {
    console.log("app.globalData.openid1",app.globalData.openid)

    // 调用云函数获取openid,并通过wx.getUserInfo({})获取用户信息
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user : ', res)
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid

        wx.showToast({
          title: '已登录',
        })

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
  },
  //获取关注人数
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
        // console.log("sfdv",res) 
        this1.setData({
          num : res.result.a.length
        })
       },
       fail: console.error
     })
    },
  
})