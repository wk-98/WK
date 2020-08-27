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
    userInfo1:null,
    icon_color:'#000',
    icon:'like-o',
    signal:1,
    _id:'',
   

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
      const app = getApp()
     
      db.collection('cn').doc(options.id).get().then(res => {
        
        if(res.data._openid==app.globalData.openid){
          this.setData({
            signal:2
          })
          
        }else{
          this.chexk()
        }
        this.setData({
          task:res.data
        })
        console.log("task",this.data.task) 
       
        
      }),
      db.collection('comment').where({
        _id2: options.id
      })
      .get().then(res => {
        console.log("zhel",res)
        this.setData({
          com:res.data
        })
        console.log("com",this.data.com)
        
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
  //检查是否已经关注了该用户
  chexk:function(){
    const app = getApp() 
   console.log("chexk方法")
    const db = wx.cloud.database()
    // where 查询操作
    db.collection('concern').where({
      // 查询条件
      _openid:app.globalData._openid
    })
    .get()
    .then(res => {
      // 查询数据成功
      console.log("zhixing1",res)
      if(res.data.length!=0){
        for(var i =0 ;i < res.data[0].B_openid.length; i++){
        if(res.data[0].B_openid[i]._openid==this.data.task._openid){
          this.setData({
            icon:'like',
            icon_color:'#f00',
            signal:3
          }) ;
          break;
        }
      }
      }
      
    }).catch(err => {
      // 查询数据失败
      console.log("失败",err)
    })
  },

/**
 * 点击关注事件,点击取消关注事件
 */
concern:function(event){
 const db = wx.cloud.database()
 const _ = db.command
  const app = getApp() 
  if(app.globalData.openid){
   console.log("openid",app.globalData.openid)
// where 查询操作
db.collection('concern').where({
  _openid:app.globalData._openid
})
.get()
.then(res => {
  // 查询数据成功
  console.log("查询",res)
 
  this.setData({
    icon:'like',
    icon_color:'#f00',
    signal:3
  }) 
  if(res.data.length){
    //更新数据
    // update 更新操作
    // primary key 要更新的那条数据的主键id
    console.log("res.data._id",res.data[0]._id)
    db.collection('concern').doc(res.data[0]._id)
    .update({
      // 想要更新后的数据
      data: {
        B_openid:_.push([{

            _openid:this.data.task._openid,
          userInfo:this.data.task.userInfo
        }])
      }
    }).then(res => {
      // 更新数据成功
      console.log(res)
    }).catch(err => {
      // 更新数据失败
      console.log(err)
    })

  }else{
    //插入数据
    // add 插入操作
    db.collection('concern').add({
      // 要插入的数据
      data: {
       B_openid:[{
         _openid:this.data.task._openid,
        userInfo:this.data.task.userInfo
      }]
      }
    }).then(res => {
      // 插入数据成功
      console.log("插入成功",res)
    }).catch(err => {
      // 插入数据失败
      console.log("插入失败",err)
    })
  }
}).catch(err => {
  // 查询数据失败
  console.log(err)
  
})
  }else{
    wx.showToast({
      title: '登录才能进行该操作，步骤：点击“我的”页面',
      icon:'none'
    })
  }
   
},
unconcern:function(event){
  const app = getApp() 
  if(app.globalData.openid){
  console.log("取消关注",event)
  this.setData({
    icon:'like-o',
    icon_color:'#000',
    signal:1
  })
  const db = wx.cloud.database()
  const _ = db.command
  const app = getApp()
  
        // where 查询操作
        db.collection('concern').where({
          // 查询条件
          _openid:app.globalData._openid
        })
        .get()
        .then(res => {
          // 查询数据成功
          console.log(res)
          db.collection('concern').doc(res.data[0]._id)
          .update({
            // 想要更新后的数据
            data: {
             
              B_openid: _.pull({
                _openid:_.eq(this.data.task._openid)
            })
            }
          }).then(res => {
            // 更新数据成功
            console.log(res)
          }).catch(err => {
            // 更新数据失败
            console.log(err)
          })
        }).catch(err => {
          // 查询数据失败
          console.log(err)
        })
      }else{
        wx.showToast({
          title: '登录才能进行该操作，步骤：点击“我的”页面->“点击登录”',
          icon:'none'
        })
      }
  
},
//删除自己的动态
delete(){
  const db = wx.cloud.database()
  let this1 = this;
  const app = getApp()
  //console.log("app",app.flag)
  wx.showModal({
    cancelColor: 'cancelColor',
    title: '提示',
    content: '确定要删除该动态吗？',

    success (res) {
      if (res.confirm) {
        console.log('用户点击确定')
        //const _ = db.command
    // remove 删除操作
    // primary key 要删除的那条数据的主键id
    db.collection('cn').doc(this1.data.task._id)
    .remove()
    .then(res => {
      // 删除数据成功
      console.log("成功删除",res)
      app.flag = 1,
      wx.navigateBack({
        delta: 0,
         success:res=>{
           wx.showToast({
           title: '删除成功',
           icon:'success'
          })
        }
      })
     
    }).catch(err => {
      // 删除数据失败
      console.log(err)
    })
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
  
},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
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