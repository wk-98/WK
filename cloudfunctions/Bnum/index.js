// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// 云函数入口函数
//传入动态的_id; type类型标志，1是添加点赞数，2是添加评论数
exports.main = async (event, context) => {
console.log(event)
let num = 0;

  if(event.type == 1){
    await db.collection('cn').where({
      // 查询条件
      _id:event._id
    })
    .get()
    .then(res => {
      // 查询数据成功
      console.log("asfdfvfd",res)  
      num = res.data[0].Bnum + 1
      db.collection("cn").doc(event._id).update({
                data:{
                  Bnum:num
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

  // await db.collection("cn").doc(event._id).get({
  //     success:function(res){
  //       console.log("af",res)
  //       num = res.data.Bnum + 1;
  //       db.collection("cn").doc(event._id).update({
  //         data:{
  //           Bnum:num
  //         },
  //         success: res =>{
  //           console.log("更新成功")
  //         },fail:err =>{
  //           console.log(err);
  //         }
  //       }) 
  //     }
  //   })
    
  }


}