// miniprogram/pages/tabmy/myupdate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    task:[],
    value:null,
    task_length:null,
    _openid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {  
    const app = getApp()
    //console.log("onload")
    //console.log("app2",app.flag)
    if(app.flag==2){
       this.data._openid=options._openid;
    this.getdata();
    }else{
      this.getdata();
    }
   
  
  },

  onShow:function(){
    //console.log("onshow")
    const app = getApp()
    //console.log("app1",app.flag)
    if(app.flag==1){
      //console.log("onshow")
      this.data.task=[],
      this.data.task_length=null,
      this.data.value=null,
      this.pagedata.skip=0,
      this.onLoad()
      
    }
   

  },



//获取首页渲染数据
getdata:function(callback){

    //console.log("传过来的_openid",this.data._openid)
  if(!callback){
    callback = res =>{}
  }
  const db =wx.cloud.database();
  const todos =db.collection('cn').where({
    _openid:this.data._openid
  });

  wx.showLoading({
    title: '数据加载中',
  })
  todos.skip(this.pagedata.skip).get().then(res =>{
    let oldData=this.data.task;
    this.data.task_length=this.data.task.length
   
    this.setData(
      {
        task:oldData.concat(res.data)
      },res =>{
      //   console.log("拿数据前"+ this.data.task_length)
      // console.log("拿数据后"+this.data.task.length)
      //console.log("获取数据成功！")
      if( this.data.task_length== this.data.task.length){
        //console.log("没有数据更新")
      }else{
        this.pagedata.skip=this.data.task.length
        //console.log("加20分页")
      }  //console.log("当前过滤页数"+this.pagedata.skip)
     
      wx.hideLoading({
        success: (res) => {},
      })
        callback();
    }
    )
  })
},
//跳页
pagedata:{
  skip:0
},
 //获取了数据之后再执行下拉刷新
 onPullDownRefresh:function(){
  //console.log("下拉刷新")
  this.getdata(res=>{wx.stopPullDownRefresh();});

},
//底部刷新
onReachBottom:function(){

  this.getdata(res =>{});
  //console.log("底部刷新")

},
  /**
   * 生命周期函数--监听页面初次渲染完成，第一次点开页面执行一次
   */
  onReady: function () {

  }

 
  
})