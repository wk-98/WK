
// pages/todoinfo/todoinfo.js
const db = wx.cloud.database();
const _ = db.command;
const app = getApp(); 
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

    signal:1,    //控制页面渲染，=1：关注、=3：没关注、=2：非自己发布的动态（控住显示删除）
    _id:'',     //记住动态的_id
   flag:1,    //标记是否点赞,1是没有点赞，2是已经点赞
    info:'',//评论的内容

    aaa:'' , //记住评论内容
    

    comment_time:null
  
   


  },
  pagedata:{

    
  },

  GetComment_time(){

    wx.cloud.callFunction({
      name: 'time',
      success: res => {
       
        console.log("返回当前发布时间",res)

          this.data.comment_time=res.result.timestamp
          console.log("当前评论时间：",this.data.comment_time)

      },
      fail: err => {
        console.error('[云函数] [时间函数] 调用失败：', err)
      }
    })
  },
  getComment:function(){

    db.collection('comment').where({
      b_id: this.data.task._id
    })
    .get().then(res => {
      this.setData({
        com:res.data
      })
      // app.flag2 = true
      // this.Bnum(3)
      // this.message('评论')
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     console.log(options.id)
      // console.log(options.id)
      //const app = getApp()
     this.data._id = options.id
     app.flag1 = 1
     app.flag3 = false
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
        b_id: options.id
      })
      .get().then(res => {
        console.log("载入评论内容：",res)
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

onShow:function(){
  // app.flag3 = false
},

  //检查是否已经关注了该用户
  chexk:function(){
    //const app = getApp() 
   console.log("chexk方法")
   // const db = wx.cloud.database()
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
        //检查是否关注了该用户
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
       //检查是否点赞了该动态
       for(var i =0 ;i < res.data[0].dianzan.length; i++){
        if(res.data[0].dianzan[i]._id==this.data._id){
          this.setData({
            flag:2
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
 //const db = wx.cloud.database()
 //const _ = db.command
  //const app = getApp() 
  if(JSON.stringify(app.globalData.userInfo)!="{}"){
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
  this.message('关注')
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
  if(JSON.stringify(app.globalData.userInfo)!="{}"){
  console.log("取消关注",event)
  this.setData({
    icon:'like-o',
    icon_color:'#000',
    signal:1
  })

 
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
 // const db = wx.cloud.database()
  let this1 = this;
  //const app = getApp()
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

//点赞事件
dianzan:function(event){
  if(JSON.stringify(app.globalData.userInfo)!="{}"){
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
    flag:2
  }) 
  app.flag1 = app.flag1 + 1
  this.Bnum(1)
  this.message('点赞')
   if(res.data.length){
     //更新数据
     // update 更新操作
     // primary key 要更新的那条数据的主键id
     console.log("res.data._id",res.data[0]._id)
     db.collection('concern').doc(res.data[0]._id)
     .update({
       // 想要更新后的数据
       data: {
         dianzan:_.push([{
             _openid:this.data.task._openid,
             userInfo:this.data.task.userInfo,
             _id:this.data._id
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
        dianzan:[{
              _openid:this.data.task._openid,
             userInfo:this.data.task.userInfo,
             _id:this.data._id
        }]
       }
     }).then(res => {
       // 插入数据成功
       console.log("点赞插入成功",res)
     }).catch(err => {
       // 插入数据失败
       console.log("点赞插入失败",err)
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

//取消点赞事件
cancledianzan:function(event){
  if(JSON.stringify(app.globalData.userInfo)!="{}"){
    console.log("取消点赞",event)
    this.setData({
      flag:1
    })   
    app.flag1 = app.flag1 + 1
    this.Bnum(2)
    
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
               
               dianzan: _.pull({
                  _id:_.eq(this.data._id)
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

//点赞评论触发云函数修改点赞数或者评论数
Bnum:function(event){
   // 调用云函数添加评论数和点赞数,type:1是点赞，2是取消点赞，3是评论，4是删除评论
   let name = 'Bnum'
   if(event == 3 || event == 4){
     name = 'Dnum'
   }
   wx.cloud.callFunction({
    name: name,
    data: {
      type:event,
      _id:this.data._id
    },
    success: res => {
     
    },
    fail: err => {
      
    }
  })
},

//点赞评论触发添加消息记录
message:function(event){

  let time = ''
   wx.cloud.callFunction({
    name:'time',
    // succes : res =>{
    //   console.log("谁啊",res)
    //   time = res.result.timestamp
    //   console.log("shijian ",time)  
     
    // }
  }).then(res =>{
      console.log("谁啊",res)
      time = res.result.timestamp
      console.log("shijian ",time)  
      console.log("yonhu",app.globalData.userInfo)
      wx.showToast({
        title: app.globalData.userInfo.nickName,
      })
      if(JSON.stringify(app.globalData.userInfo)!="{}"){
         wx.cloud.callFunction({
    name:'message',
    data:{
      type:event,
      B_openid:this.data.task._openid,
      userInfo:app.globalData.userInfo,
      _id:this.data._id,
      time:time,
      content:this.data.aaa
    },
    success: res => {
     console.log(res)
    },
    fail: err => {
      console.error(err)
    }
  })
      }else{
      wx.showToast({
        title: 'djcfwv',
      })
      }
     
  })
 

},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  

 

  Comment_inputedit: function(e) {
    //获取事件参数 通过事件参数获取input所对应的全局属性属性名
    var dataset = e.currentTarget.dataset;
    //获取input的当前值 通过value获取用户当前输入的内容
    var value = e.detail.value;
    //将input所对应的全局属性的属性值更新
    this.data[dataset.item] = value;
  },

  //点击提交评论
  Comment_btnClick() {

    console.log("评论内容:",this.data.info);
    this.data.aaa=this.data.info;
    if(this.data.info!=""){
    wx.cloud.callFunction({
      name: 'time',
      success: res => {
       
          this.data.comment_time=res.result.timestamp
          console.log("当前评论时间：",this.data.comment_time)

          //更新评论代码区
      
            const db = wx.cloud.database()
            const _ = db.command
              // where 查询操作
      db.collection('comment').where({
          b_id:this.data.task._id
        })
        .get()
        .then(res => {
          // 查询数据成功
          console.log("查询该人是否有评论",res)
          
          if(res.data.length){
            //更新数据
      
           
            db.collection('comment').doc(res.data[0]._id)
            .update({
              // 想要更新后的数据
              data: {
                 comment_array:_.push(
                [{      
                         comment_content:this.data.aaa,
                         comment_time:this.data.comment_time,
                         userInfo1:this.data.userInfo1
                    }]
      
          )
              }
            }).then(res => {
              // 更新数据成功
              console.log(res)
        this.Bnum(3)
        this.message('评论')
        wx.showToast({
          title: '评论成功',
          icon: 'sucess'
        })
              this.getComment();
            }).catch(err => {
              // 更新数据失败
              console.log(err)
            })
        
          }else{
            //插入数据
            // add 插入操作
            db.collection('comment').add({
              // 要插入的数据
              data: {
                  b_id:this.data.task._id,
                      comment_array:[{
                         comment_content:this.data.aaa,
                         comment_time:this.data.comment_time,
                         userInfo1:this.data.userInfo1,
                    }]
              }
            }).then(res => {
              // 插入数据成功
        this.Bnum(3)
        this.message('评论')
              console.log("插入成功",res)
        wx.showToast({
          title: '评论成功',
          icon: 'sucess'
        })
              this.getComment();
            }).catch(err => {
              // 插入数据失败
              console.log("插入失败",err)
            })
          }
        }).catch(err => {
          // 查询数据失败
          console.log(err)
          
        })
          //更新评论代码区
          
          
      },
      fail: err => {
        console.error('[云函数] [时间函数] 调用失败：', err)
      }
    })}else{
      wx.showToast({
        title: '请填写评论内容',
        icon: 'none'
      })
      console.log("没有填写评论内容")

    }

    //对数据层的info属性更新
    this.data.info = "";
    //通过setData函数对数据层的info属性再次赋值 用于触发全局属性info属性的set属性，使当前对象的模板层重新渲染完成页面更新
    this.setData({
      info: this.data.info
    })


  },
  delete_comment:function(e){
    console.log(e.currentTarget.dataset.id)
    var i=e.currentTarget.dataset.id
    this.data.com[0].comment_array.splice(i, 1);
    
    var bbb=this.data.com[0].comment_array;
    console.log(bbb)
    console.log(this.data.com[0]._id)
     db.collection('comment').doc(this.data.com[0]._id).update({
        // 想要更新后的数据
        data: {
           comment_array:bbb
        }
      }).then(res => {
        // 更新数据成功
        console.log(res)
  wx.showToast({
    title: '删除评论成功',
    icon: 'sucess'
  })
        this.getComment();
      }).catch(err => {
        // 更新数据失败
        console.log(err)
      })



   

  },

 
  



})//这2个是最底部的框框