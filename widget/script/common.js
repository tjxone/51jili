//**自定义post函数
//**params:
//**  values（json） string
//**  userAgent名称  string
//**  url地址  string
//**  fun（回调函数） function
//**  loginParams 登陆页面后退键参数 object
//**常量设置
//**
const userAgentDefalut = '51jili';
const appid = '06wygzvDdr062rNwIXTC';
const appkey = 'vxCdATZ76WeqjhF3ZNHu';
const appver = '2.6.0';
const apptype = 'ios';
// const baseUrl = 'http://ksh.51jili.com/api/';
const baseUrl = 'https://www.51jili.com/api/';

function apiPost(params) {
    //引入加密模块
    var signature = api.require('signature');
    var valuesObj,
        hash,
        arr = [];
    // 如果userAgent不存在
    if (typeof(params.userAgent)=='undefined' && !params.hasOwnProperty('userAgent')) {
        params.userAgent = userAgentDefalut;
    };
    if (typeof(params.values)=='undefined' && !params.hasOwnProperty('values')) {
        valuesObj = {};
    }else{
        valuesObj = params.values;
    }

    valuesObj.time = Date.parse(new Date());
    valuesObj.appver = appver;
    valuesObj.apptype = apptype;
    for (var item in valuesObj) {
        // php接受post的值若为空，则不接受这个键名，并且后台序列化加密的键名里面不出现
        if (valuesObj[item] != '' || valuesObj[item] == 0) {
            var temp = item + ':' + valuesObj[item];
            arr.push(temp);
        }
    }
    arr.sort();
    console.log('排序后数组' + String(arr))
    var str = '';
    for (var i of arr) {
        var index = i.indexOf(':');
        var temp = i.slice(0, index) + '=' + i.slice(index + 1);
        str += temp + '&';
    }
    str += 'appid=' + appid + '&appkey=' + appkey;
    console.log('序列化后字符串' + str)

    signature.md5({
        data: str
    }, function(ret, err) {
        //md5加密完成后
        if (ret.status) {
            hash = ret.value;
            valuesObj.sign = hash;
            console.log('发送请求的数据' + JSON.stringify(valuesObj))
                //显示等待中准备发送请求
            showWaitingProgress();
            api.ajax({
                url: baseUrl + params.url,
                method: 'post',
                timeout: 20,
                headers: {
                    "User-Agent": params.userAgent,
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                data: {
                    values: valuesObj
                },
            }, function(ret, err) {
                //收到响应后关闭等待窗口
                api.hideProgress();
                //关闭下拉刷新等待条
                api.refreshHeaderLoadDone();
                //响应错误码时显示提示
                console.log(JSON.stringify(err))
                if (err && err.code == 0) {
                    showToastMsg('网络异常，请检查网络哦~');
                } else if (err && err.code == 1) {
                    showToastMsg('网络超时，请检查网络后重试哦~~')
                } else if (err && err.code == 2) {
                    showToastMsg('网络授权错误，请检查网络后重试哦~~')
                } else if (err && err.code == 3) {
                    showToastMsg('网络数据类型错误，请检查网络后重试哦~~')
                }
                //服务器返回错误代码0时
                if(ret.code == 0){
                    //显示错误信息
                    showToastMsg(ret.msg)
                    //检查是否登陆过期，过期则跳转登陆页面
                    if(ret.msg == '登录过期'){
                        jumpToWin('login','登陆',params.loginParams)
                    }
                }else{
                  //传入ajax参数运行自定义回调函数
                  params.fun(ret, err);
                }
            })
        } else {
            //弹出转md5的错误
            showToastMsg(JSON.stringify(err))

        }
    })
}

// 刷新数据公用函数
function refreshData(params){
    // 如果请求需要token
    if(typeof(params.values) != 'undefined'&&typeof(params.values.token) != 'undefined'){
        api.getPrefs({
            key: 'token'
        },function(ret,err){
            var token = ret.value;
            if(token != ''){
                //如果有token，则发送请求取数据
                // token过期写在了apiPost里面，过期则跳转登陆页
                params.values.token = token;
                apiPost(params)
            }else{
                // 如果没有token，则跳转登陆页重新登陆
                jumpToWin('login','登陆',params.loginParams)
            }
        });
    }else{
    // 不需要token
        apiPost(params)
    }


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
//** slidBackEnabled boolen 是否允许活动后退IOS，默认允许，取值boolean (可选)
//** backEnable boolen 是否有后退键 默认有，取值boolean(可选)
//** isbackToIndex boolen 后退键是否跳转到首页，默认不跳转，取值boolean(可选)
//**
function jumpToWin(name, title, newParams) {
    // 默认设置
    var defaultParams = {
        slidBackEnabled: true,
        backEnable: true,
        isbackToIndex: false
    };
    //继承新设置
    var params = Object.assign(defaultParams, newParams)
    api.openWin({
        name: name,
        url: 'widget://html/publicHeader.html',
        pageParam: {
            name: name,
            title: title,
            backEnable: params.backEnable,
            isbackToIndex: params.isbackToIndex,
            prevPage: api.frameName,
            prevWin: api.winName
        },
        slidBackEnabled: params.slidBackEnabled
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

//***
//**打开投资详情页
//**params:
//** bid number 项目id号(必填)
//**
function jumpToDetail(bid) {
    api.openWin({
        name: 'investmentDetail',
        url: './investmentDetail.html',
        pageParam: {
            bid: bid
        }
    });
}

function refreshHeader(){
  api.setRefreshHeaderInfo({
      visible: true,
      loadingImg: 'widget://image/refresh.jpg',
      bgColor: '#fff',
      textColor: '#333',
      textDown: '下拉刷新...',
      textUp: '松开刷新...',
      showTime: true
  }, function(ret, err){
      refreshFrameData();
  });
}

function getToken(newParams) {
    var token = api.getPrefs({
        key: 'token',
        sync: true
    });
    if (token) {
        return token;
    } else {
        jumpToWin('login', '登陆', newParams);
    }
}
