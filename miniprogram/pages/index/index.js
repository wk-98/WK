

Page({

  /**
   * 页面的初始数据
   */
  data: {
    task:[],
    value:null,
    task_length:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onload")
      this.getdata();

  },
  onShow:function(){
    const app = getApp()
    console.log("app1",app.flag2)
    if(app.flag==1 || app.flag1%2 == 0 || app.flag2 == true){
      console.log("onshow")
      this.data.task=[],
      this.data.task_length=null,
      this.data.value=null,
      this.pagedata.skip=0,
      this.onLoad(),
      app.flag=2,
      app.flag2 = false
    }
    //发布成功时将全局变量app.flag置为3，跳回首页执行刷新
    if(app.flag==3){
      this.onPullDownRefresh()
      app.flag=2
    }

  },
  

  //获取了数据之后再执行下拉刷新
  onPullDownRefresh:function(){
    console.log("下拉刷新")
    this.getdata(res=>{wx.stopPullDownRefresh();});

},
  //获取首页渲染数据
  getdata:function(callback){

    console.log("getdata")
    if(!callback){
      callback = res =>{}
    }
    const db =wx.cloud.database();
    const todos =db.collection('cn');

   /* wx.showLoading({
      title: '数据加载中',
    })*/
    todos.skip(this.pagedata.skip).get().then(res =>{
      let oldData=this.data.task;
      this.data.task_length=this.data.task.length
     console.log("shuju res",res)
      this.setData(
        {
          task:oldData.concat(res.data)
        },res =>{
        //   console.log("拿数据前"+ this.data.task_length)
        // console.log("拿数据后"+this.data.task.length)
        console.log("获取数据成功！")
        if( this.data.task_length== this.data.task.length){
          console.log("没有数据更新")
        }else{
          this.pagedata.skip=this.data.task.length
          console.log("加20分页")
        }  console.log("当前过滤页数"+this.pagedata.skip)
       
        wx.hideLoading({
          success: (res) => {},
        })
        callback();
      
      }
      )




    })

    

  },
  //下拉刷新
  onReachBottom:function(){

    this.getdata(res =>{});
    console.log("底部刷新")

  },
  pagedata:{
    skip:0

  },
  
  //打印搜索框内容，内容发生改变打印一次
  onChange:function(event){

      console.log(event.detail)

  }

})