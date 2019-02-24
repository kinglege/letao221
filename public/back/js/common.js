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

// 公共部分
//1.左侧二级菜单切换
//2.左侧整体菜单切换
//3.公用退出功能
$(function(){
  //1.左侧二级菜单切换
  $('.lt_aside .category').click(function(){
    $(this).next().stop().slideToggle();
  })
  //2.左侧整体菜单切换
  $('.lt_topbar .icon_menu ').click(function(){
    $('.lt_aside').toggleClass('hidemenu')
    $('.lt_main').toggleClass('hidemenu')
    $('.lt_topbar').toggleClass('hidemenu')
  })

  //3.公用退出功能
  $('.lt_topbar .icon_logout').click(function(){
    //让模态框显示
    $('#logoutModal').modal('show');
  })
  $('#logoutBtn').click(function(){
    //退出时发送ajax请求
    $.ajax({
      type:'get',
      url:'/employee/employeeLogout',
      dataType:'json',
      successs:function(info){
        if(info.success==true){
          location.href='login.html';
        }
      }
    })
  })
})