import * as Ajax from "@lib/Ajax"
import swal from "sweetalert"

class wxShare{
    constructor() {
        var appid;
        var signature;
        var nonceStr;
        var timestamp;
        var url = document.location.href;
        var geturl = "http://common.mn.sina.com.cn/public/activity/weixin/shara_jssdk/jsoncall.php?rnd="+Math.random();
        // var geturl = "http://it.mn.sina.com/public/weixin/shara_jssdk/jsoncall.php?callback=?&rnd="+Math.random();
        // Ajax.getJSON(geturl + '&url=' + encodeURIComponent(url), function(json){
        Ajax.getJSON(geturl + '&url=' +encodeURIComponent(url), function(json){
            signature = json.signature;
            appid = json.appId;
            timestamp = json.timestamp;
            nonceStr = json.nonceStr;
            wx.config({
                debug: false,
                appId: appid,
                timestamp: timestamp,
                nonceStr: nonceStr,
                signature: signature,
                jsApiList: ['checkJsApi','onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareQZone','onMenuShareWeibo','hideMenuItems']
            });
        })
    }
    setInfo(o) {
        try{
            var imgUrl = o.sharePic; 		//分享图片
            var lineLink = o.shareLink; 	//点击链接
            var descContent = o.shareDesc;//分享描述
            var shareTitle = o.shareTit; 	//分享标题
            var descPyq = o.sharePyq;//分享描述
            wx.ready(function(){
                //分享给朋友
                wx.onMenuShareAppMessage({title:shareTitle,desc:descContent,link:lineLink,imgUrl:imgUrl,
                    trigger:function(res){},
                    success:function(res){
                        typeof o.success === 'function' ? o.success() : null;
                    },
                    cancel:function(res){},
                    fail:function(res){},
                });
                //分享到朋友圈
                wx.onMenuShareTimeline({title:descPyq,link:lineLink,imgUrl:imgUrl,
                    trigger:function(res){},
                    success:function(res){
                        typeof o.success === 'function' ? o.success() : null;
                    },
                    cancel:function(res){},
                    fail:function(res){},
                });
                //分享到QQ
                wx.onMenuShareQQ({title:shareTitle,desc:descContent,link:lineLink,imgUrl:imgUrl,
                    trigger:function(res){},
                    success:function(res){
                        
                    },
                    cancel: function(res){},
                    fail: function(res){},
                });
                //分享到QQ空间
                wx.onMenuShareQZone({title: shareTitle,desc:descContent,link:lineLink,imgUrl:imgUrl,
                    success:function(res){
                        
                    },
                    cancel:function(res){},
                });
                //分享到腾讯微博
                wx.onMenuShareWeibo({title:shareTitle,desc:descContent,link:lineLink,imgUrl:imgUrl,
                    trigger:function(res){},
                    success:function(res){
                        
                    },
                    cancel:function(res){},
                    fail:function(res){},
                });
                wx.hideMenuItems({ menuList:['menuItem:copyUrl'],
                    success:function(res){},
                    fail:function(res){},
                });
            });
        }catch(e){
            swal(e);
        }
    }
}
export default wxShare;