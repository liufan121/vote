import wx from 'weixin-js-sdk'
import axios from  'axios'
const Common={
  Url:'http://203.195.218.83/vote',
  //分享相关属性
  shareTitle : "凝聚创业智慧，唱响美好武陵",
  shareDesc : "第三届“中国创翼”创业创新大赛常德选拔赛武陵赛区决赛投票系统",
  shareImgUrl :"http://www.weirdor.cn/voteing/logo.jpg",
  currentUrl:'http://www.weirdor.cn/voteing',
  appid:'wxf2d01f227c9714f1',
  appKen:'Y2R3bGppdXll',
  //获取参数
  GetRequest:function(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r!=null) return unescape(r[2]); return null; //返回参数值
  },
  Toast(that,ToastIcon,ToastText,fn){
    that.setState({
      ToastIcon:ToastIcon,
      ToastText:ToastText,
    });
    if(fn){
      fn();
    }
  },
  shareSuccessFn : function (){
    //alert('分享成功');
  },
  shareCancelFn : function (){
    //alert('分享取消');
  },
  init : function(callbackFn){
    var _this=this;
    if(undefined != callbackFn && callbackFn != null){
      this.initCallback = callbackFn;
    }
    var origUrl = window.location.href.split('#')[0];
    var url = encodeURIComponent(origUrl);
    axios({
      method: 'get',
      url:_this.Url+'/wechat/portal/signa?url='+url
    }).then((request)=>{
        if(request.status=='200'){
          var request=request.data;
          _this.appid=request.appid
          wx.config({
                debug: false,
                appId: request.appid,
                timestamp: request.timestamp,
                nonceStr: request.nonceStr,
                signature: request.signature,
                jsApiList: [
                         "onMenuShareTimeline",
                         "onMenuShareAppMessage"
                          ]
            });
            _this.initWxApi();
        }
    }).catch((request)=>{
      console.log('网络错误'+request);
    })
  },
  //是否为微信
  navigor:function(){
		var u = navigator.userAgent;
		if(u.toLowerCase().match(/MicroMessenger/i) == 'micromessenger'){
			return 2;
		}
		else{
			if(u.indexOf('Android') > -1 || u.indexOf('Adr') > -1){
				return 0;
			}
			else if(!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
				return 1;
			}
		}
	},
  getUrlParam:function(name){
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
		var r = window.location.search.substr(1).match(reg);  //匹配目标参数
		if (r!=null) return unescape(r[2]); return null; //返回参数值

	},
  initWxApi:function(){
      var _this=this;
      wx.error(function(res){
      });
      wx.ready(function(){
          wx.onMenuShareTimeline({
              title: _this.shareTitle, // 分享标题
              imgUrl:  _this.shareImgUrl, // 分享图标
              link:_this.currentUrl,
              success: function () {
                  _this.shareSuccessFn();
              },
              cancel: function () {
                _this.shareCancelFn();
              }
          });
          wx.onMenuShareAppMessage({
                title:  _this.shareTitle, // 分享标题
                desc: _this.shareDesc, // 分享描述
                imgUrl: _this.shareImgUrl, // 分享图标
                link:_this.currentUrl,
                success: function () {
                  _this.shareSuccessFn();
                },
                cancel: function () {
                  _this.shareCancelFn();
                }
            });
        });
  },
  Replace(str,new_str){
  	str = str.replace(/(\n)/g,new_str);
  	return str;
  },

}

export default Common
