//app.js
App({
  globalData : {
    openid:'',
    avatarUrl:"",
    userInfo: {},
    message : [],
  },
  flag:2,
  flag1:'',    //标记点赞状态，首页自动刷新
  flag2:false, //标志评论事件，首页自动刷新
  flag3:false,  //标志小红点的显示
  logged:false, //判断登录授权
 
  
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
       // 检查授权情况，获取用户信息
       console.log("1")
       // 查看是否授权
       let this1 = this
    wx.getSetting({
      success: function (res) {
          if (res.authSetting['scope.userInfo']) {
              wx.getUserInfo({
                  success: function (res) {
                      //从数据库获取用户信息
                      // wx.cloud.callFunction({
                      //   name:'login',
                      //   success:res
                      // })
                      wx.cloud.callFunction({
                        name:'checkuser',
                        success:res=>{
                          console.log("获取用户信息成功",res.result)
                          this1.globalData.userInfo = res.result.userInfo
                          this1.globalData.avatarUrl = res.result.avatarUrl
                          this1.globalData.openid = res.result.openid
                          this1.logged = true
                          // 监听数据库消息
                          const db = wx.cloud.database()
                          console.log("开始监听")
                          db.collection('message').where({
                            B_openid : this1.globalData.openid,
                            // status:0
                          }).watch({
                              onChange: snapshot=> {
                              //snapshot.docChanges即是返回的数据库信息，以数组的形式返回。
                                console.log('docs\'s changed events11', snapshot.docChanges)
                                if(snapshot.docChanges.length != 0){
                                  for(let i = 0; i < snapshot.docChanges.length; i++){
                                    this1.globalData.message[i] = snapshot.docChanges[i].doc
                                  }
                                  for(let i = 0; i < snapshot.docChanges.length; i++){
                                    if(this1.globalData.message[i].status == 0 ){
                                      this1.flag3 = true
                                      wx.showTabBarRedDot({index : 3})
                                      break
                                    }
                                  }
                                  console.log("消息数组", this1.globalData.message)
                                  //wx.showTabBarRedDot({index : 3})
                                }
                              },
                              onError: err=> {
                                console.error('the watch closed because of error', err)
                              }
                           })
                        },
                        fail:err=>{
                          console.log("获取用户信息失败",err)
                        }
                      })
                  }
              })
          }
      }
  })

    
    }
    
  },
 


  onHide:function(){
    watcher.close()
  }

})
