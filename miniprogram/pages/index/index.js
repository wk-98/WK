

Page({

  /**
   * 页面的初始数据
   */
  data: {
    task:null,
    task2:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
      this.getdata(res =>{});

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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  con:function(){
    
    console.log(this.data.s)
  },

  onPullDownRefresh:function(){
    this.getdata(res=>{x.stopPullDownRefresh();});
    w

},

  getdata:function(callback){

    const db =wx.cloud.database();
    const todos =db.collection('cn');
    todos.get().then(res=>{
      console.log(res);
      this.setData(
        { task:res.data.reverse() }
      ),res =>{callback();}
    });


  }

})