// miniprogram/pages/tabmy/mycollect.js
const db =wx.cloud.database();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    task:[],        //存放动态id
    _id:[]     //存放点赞的动态的
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(JSON.stringify(app.globalData.userInfo)!="{}"){
       db.collection('concern').where({
      // 查询条件
      _openid:app.globalData._openid
    })
    .get()
    .then(res => {
      // 查询数据成功
      console.log(res)  
      let a = []
      for(let i =0 ;i < res.data[0].dianzan.length; i++){
        a[i] =  res.data[0].dianzan[i]._id
      }
      this.data._id = a;
      console.log(this.data._id)
      this.getdata()
    }).catch(err => {
      // 查询数据失败
      console.log(err)
    })
    }else{
      wx.showToast({
        title: '请先登录',
      })
    }
  },
  onShow:function(){
    console.log("mycollect",onshow)
    this.setData({
      task:[]
    })
   // this.data.task = [],
    this.onLoad()
  },

  //根据点赞动态的唯一标识_id获取点赞的动态
  getdata:function(){
    //查询所关注人发布的动态
    const _ = db.command
    let this1 = this
    db.collection('cn').where({
      _id: _.in(this.data._id),
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
 //获取了数据之后再执行下拉刷新
 onPullDownRefresh:function(){
  console.log("下拉刷新")
  this.getdata(res=>{wx.stopPullDownRefresh();});

},

  // 页面上拉触底事件的处理函数
  onReachBottom: function () {

  },
})