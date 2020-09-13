// // 云函数入口文件
// const cloud = require('wx-server-sdk')
// const db = cloud.database()

// // 初始化 cloud
// cloud.init({
//   // API 调用都保持和云函数当前所在环境一致
//   env: cloud.DYNAMIC_CURRENT_ENV
// })
// // 云函数入口函数
// exports.main = async (event, context) => {

//   /*db.collection('concern').where({
//     // 查询条件
//     _openid:event.openid
//   })
//   .get()
//   .then(res => {
//     // 查询数据成功
//     console.log(res)  
//     //获取关注人的openID
//     for(var i =0 ;i < res.data[0].B_openid.length; i++){
//       event.a[i] = res.data[0].B_openid[i]._openid
//     }
    
   
//   }).catch(err => {
//     // 查询数据失败
//     console.log(err)
//   })*/
//   return {
//     sum: event.a + event.b
//   }
// }
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'wk-26412',
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  await db.collection('concern').where({
        // 查询条件
        _openid:wxContext.OPENID
      })
      .get()
      .then(res => {
        // 查询数据成功
        console.log(res)  
        event.a = res.data[0].B_openid
        //获取关注人的openID
        // for(var i =0 ;i < res.data[0].B_openid.length; i++){
        //   event.a[i] = res.data[0].B_openid[i]._openid
        // }
       //console.log("AD",event.a)
      }).catch(err => {
        // 查询数据失败
        console.log(err)
      })
      return {
          a:event.a
        }
  
}