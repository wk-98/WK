// miniprogram/pages/index/concern.js

const db =wx.cloud.database();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    task:[],        //存放动态
    B_openid:[]     //存放关注人的openID

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.check(); 
   
  },

/**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('关注')
    //this.getTabBar().init();
    this.setData({
      task:[],
      B_openid:[]
    })
    this.onLoad()
    // if(app.flag3 == true){
    //   wx.showTabBarRedDot({index : 3})
    //   app.flag3 = false
    // }
  },
 //获取关注人的openID
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
       //获取关注人数组中的每个openID
      for(var i =0 ;i < res.result.a.length; i++){
        this1.data.B_openid[i] = res.result.a[i]._openid
      }
      console.log("测试",this1.data.B_openid)
      this1.getdata()
     },
     fail: console.error
   })
  },
  //根据关注人的openID数组获取相应的动态
 getdata:function(){
   //查询所关注人发布的动态
   const _ = db.command
   let this1 = this
   db.collection('cn').where({
     _openid: _.in(this.data.B_openid),
   })
   .get({
     success: function(res) {
       // res.data 是包含以上定义的两条记录的数组
       console.log("zheli",res)
       var task1 = res.data
       task1.sort(function(a, b) {
         return b.date < a.date ? 1 : -1
       })
       this1.setData({
         task : task1
       })
     }
   })
 },
  
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
 //获取了数据之后再执行下拉刷新
 onPullDownRefresh:function(){
  console.log("下拉刷新")
  this.getdata(res=>{wx.stopPullDownRefresh();});

},

  // 页面上拉触底事件的处理函数
  onReachBottom: function () {

  },

  // 用户点击右上角分享
  onShareAppMessage: function () {

  }
})