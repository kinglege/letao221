//一进入页面发送ajax请求
$.ajax({
  type:'get',
  url:'/category/queryTopCategory',
  dataType:'json',
  success:function(info){
    console.log(info);
    var htmlStr=template('leftTpl',info);
    $('.lt_category_left ul').html(htmlStr);
    //一进一级列表渲染下面的二级列表
    render(info.rows[0].id)
  }
  
})

//根据左侧列表切换分类
$('.lt_category_left').on('click','a',function(e){
  $('.lt_category_left a').removeClass('current');
  $(this).addClass('current')
  //获取id,调用方法
  var id=$(this).data('id');
  render(id);
})

  //根据一级列表的分类,切换二级列表,完成渲染功能
  function render(id){
    $.ajax({
      type:'get',
      url:'/category/querySecondCategory',
      data:{
        id:id
      },
      datatype:'json',
      success:function(info){
        console.log(info);
        var htmlStr=template('rightTpl',info);
        $('.lt_category_right ul').html(htmlStr);
        
      }
    })
  }