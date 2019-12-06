
import React from "react"
import Reactdom from "react-dom"
import AppCompent from "./AppCompent"
import SearchList from "./SearchList"
import SearchBar from "./SearchBar"
import wxShare from "@lib/wxShare"

//微信分享文案设置
var wx = {};
wx.shareLink ="http://n.sinaimg.cn/fj/projects/index1.html"; 
wx.sharePic = "http://n.sinaimg.cn/fj/anta/img/wxShare.jpg"; 
wx.shareTit = "新浪厦门H5案例库"; 
wx.shareDesc = "可按照行业、功能、客户、时间分类检索，同时支持关键字检索案例。";
wx.sharePyq = "可按照行业、功能、客户、时间分类检索，同时支持关键字检索案例。";
let wxshare =new wxShare();
wxshare.setInfo(wx);

Reactdom.render(
	<AppCompent />,
	document.getElementById("root")
);

