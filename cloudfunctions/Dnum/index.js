// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// 云函数入口函数,3是添加评论数，评论条数加1;4是删除评论，评论数减1
exports.main = async (event, context) => {
  let num = 0;

    await db.collection('cn').where({
      // 查询条件
      _id:event._id
    })
    .get()
    .then(res => {
      // 查询数据成功
      console.log("asfdfvfd",res)  
      if(event.type == 3){
        num = res.data[0].Dnum + 1
      }
      if(event.type == 4){
        num = res.data[0].Dnum - 1
      }
      db.collection("cn").doc(event._id).update({
                data:{
                  Dnum:num
                },
                success: res =>{
                  console.log("更新成功")
                },fail:err =>{
                  console.log(err);
                }
              }) 
    }).catch(err => {
      // 查询数据失败
      console.log(err)
    })
}