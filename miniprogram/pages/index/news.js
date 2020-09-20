// miniprogram/pages/index/news.js
const app = getApp();
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    message : [],
    watch:''

    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideTabBarRedDot({index:3})
    app.flag3 = false
    app.globalData.message.sort(function(a, b) {
      return b.time < a.time ? -1 : 1
    })
    this.setData({
      message : app.globalData.message
    })
   // this.data.message = app.globalData.message
   console.log(this.data.message[0])
     console.log(this.data.message[0].content)
    // for(let i = 0; i < this.data.message.length; i++){
    //   console.log("huoqu",this.data.message[i].B_openid)
    // }
    

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
    console.log('消息')
    wx.hideTabBarRedDot({index:3})
    app.flag3 = false
    // app.globalData.message.sort(function(a, b) {
    //   return b.time < a.time ? -1 : 1
    // })
    // this.setData({
    //   message : app.globalData.message
    // })
    // 监听数据库消息
    let a =this.data.message
    console.log("开始页面监听")
   const watcher = db.collection('message').where({
    B_openid : app.globalData.openid,
    }).watch({
    onChange: snapshot=> {
     //snapshot.docChanges即是返回的数据库信息，以数组的形式返回。
    console.log('docs\'s changed events', snapshot.docChanges)
   
    if(snapshot.docChanges.length != 0 ){
      
      //this.data.message=[]
      //console.log("a",a)
      for(let i = 0; i < snapshot.docChanges.length; i++){
        console.log("snapshot.docChanges[i].dataType",snapshot.docChanges[i].dataType)
        if(snapshot.docChanges[i].dataType != "remove"){
          console.log("执行")
          a.push(snapshot.docChanges[i].doc)
        }
      }
      //去掉与全局监听到的消息重复的内容
      let hash = {};
      a = a.reduce((preVal, curVal) => {
        hash[curVal._id] ? '' : hash[curVal._id] = true && preVal.push(curVal); 
        return preVal 
      }, [])
      //console.log("a",a)
      a.sort(function(a, b) {
        return b.time < a.time ? -1 : 1
      })
      this.setData({
        message:a
      })

    }
    },
     onError: err=> {
      console.error('the watch closed because of error', err)
     }
    })
    this.data.watch = watcher                              
    
                         
                       
   

  },
 /**
   * 生命周期函数--监听页面隐藏
   * 当navigateTo或底部tab切换时调用
   */
  onHide: function () {
    console.log("关闭监听")
    wx.hideTabBarRedDot({index:3})
    app.flag3 = false
    this.data.watch.close()
  },
  onClick:function(event) {
   //点击顶部tarbar的响应事件
   
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

  //删除消息
  delete:function(event){
    console.log("delete",event)
    wx.cloud.callFunction({
      name:'delete',
      data:{
        id:event.currentTarget.dataset.id
      },
      succes:res=>{
        console.log("成功删除",res.result)
        // let b = message;
        // console.log("b",b)
        // b.splice(event.currentTarget.dataset.index, 1)
        // console.log("b1",b)

        // this.setData({
        //   message:b
        // })
      }
    })
    let b = this.data.message;
    console.log("b",b)
    b.splice(event.currentTarget.dataset.index, 1)
    console.log("b1",b)

    this.setData({
      message:b
    })
  },
 //读取消息,跳转页面
  LOOK:function(event){
    console.log("look",event)
    //将已经读取了的消息状态置为1
    db.collection('message').doc(event.currentTarget.dataset.id).update({
      data:{
        status:1
      }
    }).then(res=>{



    
    })
      wx.navigateTo({
        url: '../todoinfo/todoinfo?id='+event.currentTarget.dataset.dtid
      })
  }


  
  
})