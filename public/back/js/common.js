//进度条插件
// 第一个ajax开始发送时,开启进度条
$(document).ajaxStart(function(){
  NProgress.start();
})
//在ajax全部完成时,关闭进度条
$(document).ajaxStop(function(){
  setTimeout(function(){
    NProgress.done();
  },500)
})