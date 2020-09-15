// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  
      //上传动态的时间
      let timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      //获取当前时间   存储形式（string）年+"-"+月+"-"+日+" "+时+":"+分
      let n = timestamp * 1000;
      let date = new Date(n);
      //年
      let Y =  date.getFullYear();
      //月
      let M = ( date.getMonth() + 1 < 10 ? '0' + ( date.getMonth() + 1) :  date.getMonth() + 1);
      //日
      let D = date.getDate() < 10 ? '0' +  date.getDate() :  date.getDate();
      //时
      let h = date.getHours();
      //分
      let m = date.getMinutes();
      //console.log("当前时间：" +Y+"-"+M+"-"+D+" "+h+":"+m);
      timestamp=Y+"-"+M+"-"+D+" "+h+":"+m
    return{
      timestamp : timestamp,
      date : date 
    }
}