//**自定义post函数
//**params:
//  values（json） string
//  userAgent名称  string
//  url地址  string
//  fun（回调函数） function
//**常量设置
//**
const userAgentDefalut = '51jili';
const appid = '06wygzvDdr062rNwIXTC';
const appkey = 'vxCdATZ76WeqjhF3ZNHu';
const appver = '2.6.0';
const apptype = 'ios';


function apiPost(params,progressSwitch){
    // url,values,fun,userAgent
    if(Object.getOwnPropertyNames(params).length<4){
      params.userAgent = userAgentDefalut;
    };
    //引入加密模块
    var signature  = api.require('signature');
    var valuesObj = params.values,
        arr=[],
        hash;
    valuesObj.time = Date.parse(new Date());
    valuesObj.appver = appver;
    valuesObj.apptype = apptype;
    for(var item in valuesObj){
      // php接受post的值若为空，则不接受这个键名，并且后台序列化加密的键名里面不出现
      if(valuesObj[item]!=''){
        var temp = item+':'+valuesObj[item];
        arr.push(temp);
      }
    }
    arr.sort();
    console.log(String(arr))
    var str = '';
    for(var i of arr){
      var index = i.indexOf(':');
      var temp = i.slice(0,index)+'='+i.slice(index+1);
      str += temp+'&';
    }
    str += 'appid='+appid+'&appkey='+appkey;
    signature.md5({
      data:str
    },function(ret,err){
      //md5加密完成后
      if(ret.status){
        hash = ret.value;
        valuesObj.sign = hash;
        //显示等待中准备发送请求
        showWaitingProgress();
        api.ajax({
          url: params.url,
          method: 'post',
          timeout:20,
          headers:{
              "User-Agent":params.userAgent,
              "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"
          },
          data:{
              values:valuesObj
          },
        }, function(ret, err) {
          //收到响应后关闭等待窗口
          api.hideProgress();
          //关闭下拉刷新等待条
          api.refreshHeaderLoadDone();
          //响应错误码时显示提示
          if(err&&err.code==0){
            showNetError();
          }else if(err&&err.code==1){
            showToastMsg('网络超时，请检查网络后重试哦~~')
          }else if(err&&err.code==2){
            showToastMsg('网络授权错误，请检查网络后重试哦~~')
          }else if(err&&err.code==3){
            showToastMsg('网络数据类型错误，请检查网络后重试哦~~')
          }
          //传入ajax参数运行自定义回调函数
          params.fun(ret,err);
        })
      }else{
        //弹出转md5的错误
        showToastMsg(JSON.stringify(err))

        }
    })
}

//***
//**等待中showProgress
//**
function showWaitingProgress() {
    api.showProgress({
        text: '使劲加载中..',
        title: '客官请稍等..',
        modal: true,
        animationType: 'fade'
    });
}

//***
//**网络异常showProgress
//**
function showNetError() {
    api.toast({
        msg: '网络异常，请检查网络哦~',
        duration: 2000,
        location: 'center',
        global: false
    })
}

//***
//**消息提醒toast
//**
function showToastMsg(content) {
    api.toast({
        msg: content,
        duration: 2000,
        location: 'center',
        global: false
    })
}

//***
//**打开外部网址
//**
function open51Url(jumpUrl, jumpTitle) {
    api.openWin({
        name: 'urlWin',
        url: 'widget://html/urlWin.html',
        useWKWebView: true,
        historyGestureEnabled: true,
        pageParam: {
            url: 'https://www.51jili.com/' + jumpUrl,
            title: jumpTitle
        },
        scaleEnabled: true,
        allowEdit: true
    })
}

//***
//**打开外部网址
//**
function openUrl(jumpUrl, jumpTitle) {
    api.openWin({
        name: 'urlWin',
        url: 'widget://html/urlWin.html',
        useWKWebView: true,
        historyGestureEnabled: true,
        pageParam: {
            url: jumpUrl,
            title: jumpTitle
        },
        scaleEnabled: true,
        allowEdit: true
    })
}


//***
//**打开新的win
//**params:
//** name string 名字(必填)
//** title  string 标题（必填）
//** isback boolen 是否后退(可选)
//**
function jumpToWin(name, title, isbackvalue) {
    api.openWin({
        name: name,
        url: 'widget://html/publicHeader.html',
        useWKWebView: true,
        historyGestureEnabled: true,
        pageParam: {
            name: name,
            title: title,
            isback: !isbackvalue ? true : false
        }
    })
}
//导航栏共用事件
$('.nav-tab li').on('touchend', function() {
    var $this = $(this);
    var this_id = $this.attr('data-target');
    $this.addClass('active').siblings('li').removeClass('active');
    $('.nav-list').each(function() {
        $(this).removeClass('active');
        $('#' + this_id).addClass('active');
    })
});

//***
//**跳到主页指定frame
//**params:
//** index number 数字(必填)
//**
function jumpToIndex(index) {
    api.execScript({
        name: 'index',
        script: "randomSwitchBtn($('.footer-nav li:eq(" + index + ")')[0])",
    })
    api.closeToWin({
        name: 'index'
    })
}
