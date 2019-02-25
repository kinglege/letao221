$(function(){
  // 发送ajax请求,渲染页面
  var currentPage=1;//当前页
  var pageSize=5;//每页的条数
  render();
  function render(){
    $.ajax({
      type:'get',
      url:'/category/querySecondCategoryPaging',
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      dataType:'json',
      success:function(info){
        console.log(info);
        var htmlStr=template('secondTpl',info);
        $('tbody').html(htmlStr)

        // 实现分页插件初始化
        $("#paginator").bootstrapPaginator({
          //版本号
          bootstrapMajorVersion: 3,
          // 当前页
          currentPage: info.page,
          // 总页数
          totalPages: Math.ceil(info.total / info.size),
          // 给页码添加点击事件
          onPageClicked: function(a, b, c, page) {
            // 更新当前页
            currentPage = page;
            // 并且重新渲染
            render();
          } 
        })
      }
    })

  }
  //点击添加分类按钮,显示模态框
  $('#addBtn').click(function(){
    $('#addModal').modal('show');
    //发送请求,获取一级分类的所有数据
    $.ajax({
      type: 'get',
      url: '/category/queryTopCategoryPaging',
      data: {
        page: 1,
        pageSize: 100 
      },
      dataType: 'json',
      success: function( info ) {
        console.log( info );
        var htmlStr = template('dropdownTpl', info);
        $('.dropdown-menu').html(htmlStr);
      }
    })
  });
  // 3. 给下拉菜单添加可选功能
  $('.dropdown-menu').on('click', 'a', function() {
    // 获取 a 的文本
    var txt = $(this).text();
    // 设置给 button 按钮
    $('#dropdownText').text(txt);
    //获取id,设置给隐藏域
    var id=$(this).data('id');
    console.log($('[name="categoryId"]'));
    console.log(id);
    
    
    $('[name="categoryId"]').val(id);
    //只要给隐藏域赋值了,此时校验状态应该更新成成功
    $('#form').data('bootstrapValidator').updateStatus('categoryId','VALID');

  })


  //4.完成文件初始化
  $('#fileupload').fileupload({
    dataType:'json',
    //文件上传完成时的回调函数
    done:function(e,data){
      console.log(data);
      var result=data.result;//后台返回的结果
      var picUrl=result.picAddr;//获取返回结果中的图片路径;
      // 设置给img src
      $('#imgBox img').attr('src',picUrl);
      // 路径赋值给隐藏域
      $('[name="brandLogo"]').val(picUrl);
      // 隐藏域有值了,就能更新成成功状态
      $('#form').data('bootstrapValidator').updateStatus('brandLogo', 'VALID');     
      console.log( $('#form').data('bootstrapValidator'));
      
    }
  });


 // 5. 直接进行校验
 $('#form').bootstrapValidator({
  // 配置 excluded 排除项, 对隐藏域完成校验
  excluded: [],

  // 配置图标
  feedbackIcons: {
    valid: 'glyphicon glyphicon-ok',
    invalid: 'glyphicon glyphicon-remove',
    validating: 'glyphicon glyphicon-refresh'
  },

  // 配置校验字段列表
  fields: {
    // 选择一级分类
    categoryId: {
      validators: {
        notEmpty: {
          message: '请选择一级分类'
        }
      }
    },
    // 输入二级分类名称
    brandName: {
      validators: {
        notEmpty: {
          message: '请输入二级分类名称'
        }
      }
    },
    // 二级分类图片
    brandLogo: {
      validators: {
        notEmpty: {
          message: '请选择图片'
        }
      }
    }
  }
});
//注册表单校验成功事件,阻止默认提交,通过ajax提交
$('#form').on('success.form.bv',function(e){
  e.preventDefault();//阻止默认提交
  $.ajax({
    type:'post',
    url:'/category/addSecondCategory',
    data:$('#form').serialize(),
    dataType:'json',
    success:function(info){
      console.log(info);
      if(info.success){
        //添加成功,关闭模态框
        $('#addModal').modal('hide');
        //从新从第一页开始渲染
        currentPage=1;
        render();
        //将表单元素重置(内容和状态都重置)
        $('#form').data('bootstrapValidator').resetForm(true);

        //button和img不是表单元素,手动重置
        $('#dropdownText').text('请选择一级分类');
        $('#imgBox img').attr('src', './images/none.png');
      }
      
    }
  })

})




})
