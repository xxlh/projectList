import "../css/index.css"
import React from "react";
import SearchList from "./SearchList"
import SearchBar from "./SearchBar"
import SearchTabs from "./SearchTabs"
import Item from "./Item"
import ListView from "./ListView"
import axios from "axios"
import 'react-tabs/style/react-tabs.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import swal from 'sweetalert'



var SearchTitle	= require("../assets/SearchBar1.json");
/**
 * @SearchTitleArray  {Array}
 * @return {Array}
 */
function getImageURL(SearchTitleArray){
	for (var i = 0, j = SearchTitleArray.length; i < j; i++) {
		var singleImageData = SearchTitleArray[i];
		SearchTitleArray[i] = singleImageData;
	  }
	  return SearchTitleArray;
}
SearchTitle = getImageURL(SearchTitle);


class AppCompent extends React.Component{
	constructor(porps){
		super(porps);
		this.handleKeyword = this.handleKeyword.bind(this);
		this.handlesearch = this.handlesearch.bind(this);
		// this.handleScroll = this.handleScroll.bind(this);
		this.state = {
			SearchTitleData:SearchTitle,
			keyword: [],
			tabIndex: 0,
			searchkeyword:'',
			page: 1,
			article: [],//文章列表
			total:0,
		};
	}
	

	handleKeyword(e){
        this.setState({
			keyword: e.target.value
		});
	}
	

	handlesearch(value) {
		this.setState({page: 1});
		document.querySelector('.img-sec').scrollTop=0;
		// alert('Your favorite flavor is: ' + value);
		this.setState({searchkeyword: value});
		this.getData(1,value) 
	}

 
    componentDidMount() {//组件被加载之后，默认加载第一页数据
        this.getData(1,this.state.searchkeyword);
    }
    onRefresh(){//下拉刷新函数
        this.setState({page: 1});
        this.getData(this.state.page,this.state.searchkeyword);
    }
    onLoadMore() {//加载更多函数
        var page = this.state.page + 1;
        console.log(page)
		this.setState({page: page});
		//var isTotal=this.state.total/5===page;
        this.getData(page,this.state.searchkeyword);
    }
    getItem(article) {
        return <Item key={article.id} article={article}/>;
    }
    getData(page,searchWord) {//获取数据的函数
		var self = this;
		var data={};
		data.page=page;
		data.perpage=5;
		data.search=searchWord;
		axios.post('https://eexx.me/sina/api/public/?s=Projects.getList',data).then(function(response){
			if(response.data.ret == 200 ){
				if (response.data.data.page == 1) {//如果是第一页，直接覆盖之前的数据
					self.setState({article: response.data.data.items,total:response.data.data.total})
				  //父组件的setState  改变的自己的状态的同时触发了自组件的componentWillReceiveProps
				   // 子组件可以在componentWillReceiveProps里接受新的参数，改变自己的state会自动触发render渲染
				} else {
					self.setState({//否则累加数组
						article: self.state.article.concat(response.data.data.items),
						total:response.data.data.total
					})
				}
				if(response.data.data.total<=page*5)
				document.querySelector('.scroll-loading').innerHTML="到底了"
			}else{
				swal(response.data.msg);
			}
			
		})
        
    }
	render(){
		var tabPanelList=[];
		var tabList=[];
		var tabs='';
		for (var i = 0, j = this.state.SearchTitleData.length; i < j; i++) {
			var  SearchTitles = [];
			var SearchData=this.state.SearchTitleData[i].data;
			for (var k = 0, m = SearchData.length; k < m; k++) {
				SearchTitles.push(<SearchList  key={k} title={SearchData[k].title}  hotSubmit={this.handlesearch}/>);
			}
		tabPanelList.push(<TabPanel key={SearchTitles}>{SearchTitles}</TabPanel>);
		tabList.push(<Tab key={this.state.SearchTitleData[i].labletitle}>{this.state.SearchTitleData[i].labletitle}</Tab>);
		tabs=<Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex })}><TabList>{tabList}</TabList>{tabPanelList}</Tabs>
		};
		
		
		return(
			<section className="page">
				<SearchBar keyChange={this.state.keyword} bindChange={this.handleKeyword} searchSubmit={this.handlesearch}/>
				<section className="stage" ref="stage">
					<section className="search-tab" >
						<SearchTabs></SearchTabs>
						{tabs}
					</section>
					<section className="img-sec">
					<ListView 
						onRefresh={this.onRefresh.bind(this)}  //从外面传进去的下拉刷新回调函数
						onLoadMore={this.onLoadMore.bind(this)}//从外面传进去的加载更过回调函数
						article={this.state.article}//从外面传进去的文章列表数据数组
						total={this.state.total}//总数
						searchkeyword={this.state.searchkeyword}//总数
						getItem={this.getItem.bind(this)} //从外面传进去的获取列表子项的回调函数
							/>
					 </section>
				</section>
			</section>
		)
	}
	
}
export default AppCompent;