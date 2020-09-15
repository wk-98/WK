//app.js
App({
  globalData : {
    openid:'',
    avatarUrl:"",
    userInfo: {},
  },
  flag:2,
  flag1:'',    //标记点赞状态，首页自动刷新
  flag2:false, //标志评论事件，首页自动刷新
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {  
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'wk-26412',
        traceUser: true,
      })
       // 获取用户信息
    wx.getSetting({
      success: res => {
        //console.log(this.globalData.openid)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.globalData.avatarUrl = res.userInfo.avatarUrl,
              this.globalData.userInfo = res.userInfo
            }
          })
        }
      }
    })
    this.onGetOpenid()
    }
    
  },
  onGetOpenid: function() {
    
    //console.log("app.globalData.openid1",this.globalData.openid)
    // 调用云函数获取openid,并通过wx.getUserInfo({})获取用户信息
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        //console.log('[云函数] [login] user : ', res)
       // console.log('[云函数] [login] user openid: ', res.result.openid)
        this.globalData.openid = res.result.openid
        this.monitor()
      },
      fail: err => {
        //console.error('[云函数] [login] 调用失败', err)
      }
    })
  },

  monitor:function(){
    //监听数据库消息
    const db = wx.cloud.database()
    db.collection('message').where({
      B_openid:this.globalData.openid
    }).watch({
      onChange: snapshot=> {
        //snapshot.docChanges即是返回的数据库信息，以数组的形式返回。
        console.log('docs\'s changed events', snapshot.docChanges)
        // if(snapshot.docChanges.length != 0){
        //   let message = []
        //   for(let i = 0; i < snapshot.docChanges.length; i++){
        //     message[i] = snapshot.docChanges[i].doc
        //   }
        //   console.log("消息数组",message)
        //   wx.cloud.callFunction({
        //     name : 'notice',
        //     data:{
        //       message : message
        //     },
        //     success : res =>{
        //       console.log("消息云函数调用成功")
        //     }
        //   })
        // }
      },
      onError: err=> {
        console.error('the watch closed because of error', err)
      }
    })
  }
  

})
