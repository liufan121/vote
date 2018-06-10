import React from 'react'
import Common from  './common'
import wx from 'weixin-js-sdk'
import axios from  'axios'
import './global.scss'
import WeUI from 'react-weui';
import 'weui';
import 'react-weui/build/packages/react-weui.css';
import homebackground from './images/bg.png';
import libackground from './images/bg2.png';
const {Toast,Icon} = WeUI;
var _this;
const homeImage = {
    backgroundSize: 'cover', //记得这里100%
    //或者下面这种也行
    backgroundImage: 'url(' + homebackground + ')',
    height:window.screen.height,
    width:'100%'
}
const liImage={
    backgroundSize: '100% 100%', //记得这里100%
    //或者下面这种也行
    backgroundImage: 'url(' + libackground + ')',
}
var _switch = false;
var _time = null;

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      subscribe:false,
      show:false,
      openid:'',
      list:[],
      exShow:false,
      display:'none'
    }
  }
  componentWillMount(){
    _this=this;
    console.log(Common.GetRequest('code'));
    if(!Common.GetRequest('code')){
      window.location.replace('https://open.weixin.qq.com/connect/oauth2/authorize?appid='+Common.appid+'&redirect_uri='+encodeURIComponent(Common.currentUrl)+'&response_type=code&scope=snsapi_base&state=123#wechat_redirect')
    }
    else{
      var code=Common.GetRequest('code');

      axios({
        method: 'get',
        url:Common.Url+'/wechat/portal/userInfo?code='+code
      }).then((request)=>{
          if(request.status=='200'){
            var request=request.data;
            if(request.code=='200'){
              this.setState({
                'subscribe':request.userInfo.subscribe,
                'exShow':true,
                'openid':request.userInfo.openId
              });
              Common.init();
            }
            else if(request.code=='500'){
              this.setState({
                'subscribe':false,
                'exShow':true,
              });
              Common.init();
            }
            else{
              window.location.replace(Common.currentUrl);
            }
          }
      }).catch((request)=>{
        console.log('网络错误'+request);
      })
    }
    axios({
      method: 'get',
      url:Common.Url+'/company/list'
    }).then((request)=>{
        if(request.status=='200'){
          var request=request.data;
          if(request.code=='200'){
            _this.setState({
              list:request.data
            })
          }
        }
    }).catch((request)=>{
      Common.Toast(_this,'cancel','网络错误');
    })
  }
  onClick(index){
      if(this.state.subscribe){
          //逻辑操作
          var id=this.state.list[index].id;
          var openid=this.state.openid;
          this.setState({
            show:true
          });
          Common.Toast(_this,'loading','投票中...');
          axios({
            method: 'post',
            url:Common.Url+'/tiket/cast',
            data:{open_id:openid,company_id:id}
          }).then((request)=>{
              if(request.status=='200'){
                var request=request.data;
                if(request.code=='200'){
                  Common.Toast(_this,'success-no-circle','投票成功',()=>{
                    setTimeout(function(){
                      _this.setState({
                        show:false
                      })
                    },1000);
                  });
                  var array=_this.state.list;
                      array[index].count+=1;
                  _this.setState({
                    list:array
                  });
                }
                else{
                  Common.Toast(_this,'cancel',request.msg,()=>{
                    setTimeout(function(){
                      _this.setState({
                        show:false
                      })
                    },1000);
                  })
                }
              }
          }).catch((request)=>{
            Common.Toast(_this,'cancel','网络错误');
          })
      }
      else{
        this.setState({
          display:'flex'
        })

      }
  }
  closeWx(){
    this.setState({
      display:'none'
    })
  }
  gtouchstart(){
    _time=setTimeout(()=>{
      setTimeout(()=>{
        window.location.href=window.location.href;
      },2000);
    },1000);
  }
  touchmove(){
    clearTimeout(_time);
    _switch = true;
  }
  touchend(){
    clearTimeout(_time);
    if(_switch){
        _switch = false;
        return;
    }
  }
  render(){
    const {list,openid,exShow,display}=this.state;
    if(!exShow){
      return (<div></div>);
    }
    return(
      <div>
        <div className='bg' style={ homeImage }></div>
        <div className='content'>
            <div className='c_title'><img src={require('./images/title.png')} /></div>
            <div className='c_time'><img src={require('./images/time.png')} /></div>
            <div className='c_content'>
              {
                list.map((data,index)=>
                <li key={index}>
                  <div className='t_bg' style={ liImage }><img src={data.imageUrl} /></div>
                  <div className='t_li'>
                    <p>{data.id}号</p>
                    <p>姓名：{data.name}</p>
                    <p>项目：{data.remark}</p>
                    <p>票数：{data.count}</p>
                  </div>
                  <button className='t_submit' onClick={this.onClick.bind(this,index)}>给TA投票</button>
                </li>
              )}
            </div>
            <center className='footer_bottom'>致知文创</center>
        </div>
        <div className='model_wx_cade' style={{'display':display}}>
          <div className='model_wx'>
            <Icon value="clear" onClick={this.closeWx.bind(this)} className='model_clera' />
            <img src={require('./images/qrcode.jpg')} onTouchStart={this.gtouchstart.bind(this)} onTouchMove={this.touchmove.bind(this)} onTouchEnd={this.touchend.bind(this)} />
            <center>请先关注公众号，再进行投票!</center>
          </div>
        </div>

        <Toast icon={this.state.ToastIcon} className='load_size' show={this.state.show}>{this.state.ToastText}</Toast>
      </div>

    )
  }
}
export default Main;
