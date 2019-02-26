$(function(){
  var currentPage=1;//当前页
  var pageSize=2;//当前页的条数
  var picArr=[];//存放提交的图片
  render();
  function render(){

  
  $.ajax({
    type:'get',
    url:'/product/queryProductDetailList',
    data:{
      page:currentPage,
      pageSize:pageSize
    },
    dataType:'json',
    success:function(info){
      console.log(info);
      var htmlStr=template('productTpl',info);
      $('tbody').html(htmlStr);
      

      //完成分页初始化
      $('.paginator').bootstrapPaginator({
        //版本号
        bootstrapMajorVersion:3,
        //当前页
        currentPage:info.page,
        //总页数
        totalPages:Math.ceil(info.total/info.size),
        //给页码添加点击事件
        onPageClicked:function(a,b,c,page){
          console.log(page);
          //更新当前页
          currentPage=page;
          //渲染
          render();
          
        }
      })
    }
  })
};
//2.点击添加按钮,显示模态框
$('#addBtn').click(function(){
  $('#addModal').modal('show');
  //发送ajax请求,渲染下拉列表,获取二级分类数据
  $.ajax({
    type:'get',
    url:'/category/querySecondCategoryPaging',
    data:{
      page:1,
      pageSize:100
    },
    dataType:'json',
    success:function(info){
      console.log(info);
      var htmlStr=template('dropdownTpl',info);
      $('.dropdown-menu').html(htmlStr);
      
    }
  })
});
  //3.给下拉菜单下面a添加点击事件(动态生成,事件委托)
$('.dropdown-menu').on('click','a',function(){
  //获取文本,设置给按钮
  var txt=$(this).text();
  $('#dropdownText').text(txt);
  //获取id,设置给隐藏域
  var id = $(this).data('id');
    $('[name="brandId"]').val(id);
    //将隐藏域校验状态更新成 VALID 成功状态
    $('#form').data('bootstrapValidator').updateStatus('brandId', 'VALID');
});
//4.进行文件上传初始化
    $('#fileupload').fileupload({
      dataType:'json',
      //图片上传完成的回调函数
      done:function(e,data){
        console.log(data);
        var picObj=data.result;//接收结果
        var picUrl=picObj.picAddr;//获取图片路径

        //将后台返回的图片对象添加到数组前面
        picArr.unshift(picObj);
        //追加到imgBox图片顺序最前面
        // prepend方法,添加到数据最前面
        $('#imgBox').prepend('<img style="height: 100px;" src="'+ picUrl +'" alt="">')
        //图片限制最多三张
        if(picArr.length>3){
          //删除最后一个
          picArr.pop();
          //找到最后一张图,删了
          $('#imgBox img:last-of-type').remove();
          console.log( $('imgBox img:last-of-type'));
          
        }
        if(picArr.length==3){
          //图片校验状态,更新成成功
          $('#form').data('bootstrapValidator').updateStatus('picStatus', 'VALID');
        }
      }
    });
    
    //5.添加表单校验功能
    // 5. 添加表单校验功能
  $('#form').bootstrapValidator({
    // 配置 excluded 排除项, 对隐藏域完成校验
    excluded: [],

    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    // 配置字段列表
    fields: {
      brandId: {
        validators: {
          notEmpty: {
            message: '请选择二级分类'
          }
        }
      },
      proName: {
        validators: {
          notEmpty: {
            message: '请输入商品名称'
          }
        }
      },
      proDesc: {
        validators: {
          notEmpty: {
            message: '请输入商品描述'
          }
        }
      },
      num: {
        validators: {
          notEmpty: {
            message: '请输入商品库存'
          },
          // 1  10  111  1111
          // 正则校验, 必须非零开头的数字
          // \d  0-9 数字
          // ?   表示 0 次 或 1 次
          // +   表示 1 次 或 多次
          // *   表示 0 次 或 多次
          // {n} 表示 出现 n 次
          // {n, m}  表示 出现 n ~ m 次
          regexp: {
            regexp: /^[1-9]\d*$/,
            message: '商品库存必须是非零开头的数字'
          }
        }
      },
      size: {
        validators: {
          notEmpty: {
            message: '请输入商品尺码'
          },
          // 尺码格式, 必须是 xx-xx 格式,  xx 是两位的数字
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '尺码格式, 必须是 xx-xx 格式,  xx 是两位数字, 例如: 32-40 '
          }
        }
      },
      oldPrice: {
        validators: {
          notEmpty: {
            message: '请输入商品原价'
          }
        }
      },
      price: {
        validators: {
          notEmpty: {
            message: '请输入商品现价'
          }
        }
      },
      // 标记图片是否上传满三张的
      picStatus: {
        validators: {
          notEmpty: {
            message: '请上传三张图片'
          }
        }
      }
    }
  });


  //6.注册表单校验成功事件,阻止默认提交,用ajax提交
  $('form').on('success.form.bv',function(e){
    e.preventDefault();
    //获取基础表单数据
    var paramsStr=$('#form').serialize();

    // 还需要拼接上图片数据  picArr
    // key=value&key1=value1&key2=value2
    paramsStr += '&picArr=' + JSON.stringify(picArr);
    $.ajax({
      type:'post',
      url:'/product/addProduct',
      data:paramsStr,
      dataType:'json',
      success:function(info){
        if(info.success){
          //成功关闭模态框
          $('#addModal').modal('hide');
          //重新渲染页面
          var currentPage=1;
          render();
          //重置表单状态和内容
          $('#form').data('bootstrapValidator').resetForm(true);
          //重置按钮文本和图片
          $('#dropdownText').text('请选择二级分类');
          $('#imgBox img').remove();
          picArr=[];
        }
      }
    })
  })
})