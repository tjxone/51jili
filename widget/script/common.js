//**自定义post函数
//**params:
//**  values（json） string
//**  userAgent名称  string
//**  url地址  string
//**  fun（回调函数） function
//**  slidBackEnabled(是否滑动关闭)
//**  backEnable(是否允许后退)
//**  isbackToIndex(是否后退键后退到主页)
//**常量设置
//**
const userAgentDefalut = '51jili';
const appid = '06wygzvDdr062rNwIXTC';
const appkey = 'vxCdATZ76WeqjhF3ZNHu';
const appver = '2.6.0';
const apptype = 'ios';
const base = 'http://ksh.51jili.com/';
// const baseUrl = 'http://ksh.51jili.com/api/';
// const baseUrl = 'http://bugfix.51jili.com/api/';
const baseUrl = 'http://ksh.51jili.com/api2/';
// const baseUrl = 'https://www.51jili.com/api/';
// const baseUrl = 'http://192.168.20.4/api/';

function apiPost(params,isUseProgress) {
    //引入加密模块
    var signature = api.require('signature');
    var valuesObj,
        hash,
        arr = [];
    // 如果userAgent不存在
    if (typeof(params.userAgent) == 'undefined' && !params.hasOwnProperty('userAgent')) {
        params.userAgent = userAgentDefalut;
    };
    // 如果values不存在
    if (typeof(params.values) == 'undefined' && !params.hasOwnProperty('values')) {
        valuesObj = {};
    } else {
        valuesObj = params.values;
    }

    if (typeof(isUseProgress) == 'undefined' ) {
        isUseProgress = true;
    }else{
        isUseProgress = false
    }

    valuesObj.time = Date.parse(new Date());
    valuesObj.appver = appver;
    valuesObj.apptype = apptype;
    for (var item in valuesObj) {
        // php接受post的值若为空，则不接受这个键名，并且后台序列化加密的键名里面不出现
        if (valuesObj[item] != null && valuesObj[item] != 'null') {
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
            for(var item in valuesObj){
                if(valuesObj[item]==null || valuesObj[item]=='null'){
                    delete valuesObj[item]
                }
            }
            console.log('发送请求的数据' + JSON.stringify(valuesObj))
                //显示等待中准备发送请求
            if(isUseProgress==true){
              showWaitingProgress();
            }
            api.ajax({
                url: baseUrl + params.url,
                method: 'post',
                timeout: 20,
                headers: {
                    "User-Agent": params.userAgent,
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    'authorization': getToken()
                },
                data: {
                    values: valuesObj
                },
            }, function(ret, err) {
                console.log(JSON.stringify(ret))
                //收到响应后关闭等待窗口
                api.hideProgress();
                //关闭下拉刷新等待条
                api.refreshHeaderLoadDone();
                //响应错误码时显示提示
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
                if (ret.code == 0) {
                    //显示错误信息
                    showToastMsg(ret.msg);
                    //检查是否登陆过期，过期则跳转登陆页面
                    if (ret.msg == '登录过期') {
                        // 登陆过期删除token
                        api.removePrefs({
                            key: 'token'
                        });
                        //登陆过期后登陆状态设置false
                        api.setPrefs({
                            key: 'islogin',
                            value: {'value':false,'username':'','uid':''}
                        });
                        // // 关闭输入密码窗口
                        // var dialogBox = api.require('dialogBox');
                        // dialogBox.close({
                        //     dialogName: 'alert'
                        // });
                        //跳转登陆界面
                        jumpToWin('login','登陆',params)
                    }
                } else {
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
function refreshData(params, isNeedToJumpLogin) {
    // 如果请求需要token
    if (typeof(params.values) != 'undefined' && typeof(params.values.token) != 'undefined') {
        api.getPrefs({
            key: 'token'
        }, function(ret, err) {
            var token = ret.value;
            if (token != '') {
                //如果有token，则发送请求取数据
                // token过期写在了apiPost里面，过期则跳转登陆页
                params.values.token = token;
                apiPost(params)
            } else {
                // 如果没有token，删除token属性
                //使用没有token的参数发送请求，后台不记录用户数据
                delete params.values.token
                if (isNeedToJumpLogin == false) {
                    //如果不跳转登陆，则直接发请求
                    apiPost(params)
                }else{
                    showToastMsg('请重新登陆')
                  // 如果需要跳转登陆，则跳转登陆页登陆
                  setTimeout(function(){
                    jumpToWin('login','登陆',params)
                  },150)
                }
            }
        });
    } else {
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
    var duration = 3000;
    if (content.length > 30) {
        duration = 5000
    }
    api.toast({
        msg: content,
        duration: duration,
        location: 'middle',
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
        historyGestureEnabled: true,
        pageParam: {
            url: base + jumpUrl,
            title: jumpTitle
        },
        animation: {
            type: 'movein',
            duration: 200
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
        historyGestureEnabled: true,
        pageParam: {
            url: jumpUrl,
            title: jumpTitle
        },
        animation: {
            type: 'movein',
            duration: 200
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
        name: name,
        title: title,
        slidBackEnabled: true,
        backEnable: true,
        isbackToIndex: false,
        prevPage: api.frameName,
        prevWin: api.winName
    };
    //继承新设置
    var params = Object.assign(defaultParams, newParams)
    api.openWin({
        name: params.name,
        url: 'widget://html/publicHeader.html',
        pageParam: params,
        slidBackEnabled: params.slidBackEnabled,
        animation: {
            type: 'movein',
            duration: 200
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

//***
//**打开投资详情页
//**params:
//** bid number 项目id号(必填)
//**
function jumpToWinAfterJudggingLogin(name, title, newParams) {

    var islogin = getIsLogin()
    alert( 'islogin状态'+JSON.stringify(islogin) );
    if( islogin.value == true ){
      // 默认设置
      var defaultParams = {
          name: name,
          title: title,
          slidBackEnabled: true,
          backEnable: true,
          isbackToIndex: false,
          prevPage: api.frameName,
          prevWin: api.winName
      };
      //继承新设置
      var params = Object.assign(defaultParams, newParams)
      api.openWin({
          name: params.name,
          url: 'widget://html/publicHeader.html',
          pageParam: params,
          slidBackEnabled: params.slidBackEnabled,
          animation:{
              type:'movein',
              duration:200
          }
      })
    }else{
        api.confirm({
            title: '未登录',
            msg: '系统检测到您未登录',
            buttons: ['去登陆', '再逛逛']
        }, function(ret, err){
            if(ret.buttonIndex == 1){
                var defaultParams = {
                    slidBackEnabled: true,
                    backEnable: true,
                    isbackToIndex: false,
                    prevPage: api.frameName,
                    prevWin: api.winName
                };
                var params = Object.assign(defaultParams, newParams)
                jumpToWin('login','登陆',params)
            }
        });
    }
}


function refreshHeader() {
    api.setRefreshHeaderInfo({
        visible: true,
        loadingImg: 'widget://image/refresh.jpg',
        bgColor: '#fff',
        textColor: '#333',
        textDown: '下拉刷新...',
        textUp: '松开刷新...',
        showTime: true
    }, function(ret, err) {
        refreshFrameData();
    });
}

function getToken() {
    return api.getPrefs({
        key: 'token',
        sync: true
    });
}

function customAlert(content,btnTitle,callback){
    var dialogBox = api.require('dialogBox');
    dialogBox.alert({
        texts: {
            content: content,
            leftBtnTitle: btnTitle
        },
        styles: {
            bg: '#fff',
            w: 300,
            corner:5,
            title: {
                marginT: 0,
                titleSize: 0,
                titleColor: '#000'
            },
            content: {
                color: '#000',
                size: 14
            },
            left: {
                marginB: 7,
                marginL: 20,
                marginR: 20,
                w: 260,
                h: 35,
                corner: 5,
                bg: '#ef4646',
                color:'#fff',
                size: 12
            }
        }
    },callback);
}

function alertForRetractingKeyboard(content,btnTitle){
    customAlert(content,btnTitle,function(ret,err){
        if (ret.eventType == 'left') {
            var dialogBox = api.require('dialogBox');
            dialogBox.close({
                dialogName: 'alert'
            });
            dialogBox.close({
                dialogName: 'input'
            });
        }
    })
}

function getPhone(){
    return api.getPrefs({
        key:'phone',
        sync:true
    });
}

function gesturePassword(fName){
    // 监听进入后台
    api.addEventListener({
        name:'pause'
    }, function(ret, err){
        // alert('应用进入后台');
        var timer = new Date().getTime()
        api.setPrefs({
            key: 'pauseTime',
            value: timer
        });
    });
    // 监听回到前台
    api.addEventListener({
        name:'resume'
    }, function(ret, err){
        // alert('应用回到前台');
        var islogin = getIsLogin()
        if(islogin.value == true){
            api.getPrefs({
                key: 'pauseTime'
            }, function(ret, err){
                var delay = 10000
                // alert(Number(ret.value)+delay)
                if( new Date().getTime()>Number(ret.value)+delay ){
                    api.openWin({
                        name: 'gesturePassword',
                        url: 'widget://gesturePassword.html',
                        slidBackEnabled:false,
                        animation:{
                          type:'none'
                        }
                    });
                }
            });
        }
    });
}

//设置islogin
function setIsLogin(param){
    api.setPrefs({
        key: 'islogin',
        value: param
    });
}
// 读取islogin
function getIsLogin(){
    var value = api.getPrefs({
        key: 'islogin',
        sync:true
    });
    return (value==''||value==undefined) ? false : JSON.parse(value);
}

//日期转换
function toDate(newdate){
    var year = newdate.getFullYear()
    var month = newdate.getMonth()
    var date = newdate.getDate()
    var thisdate = year+'-'+(month+1)+'-'+date;
    return thisdate
}
