import "../css/index.css"
import React from "react";
import SearchList from "./SearchList"
import SearchBar from "./SearchBar"
import SearchTabs from "./SearchTabs"
import Item from "./Item"
// import ListView from "./ListView"
import axios from "axios"
import 'react-tabs/style/react-tabs.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import swal from 'sweetalert';
import { ListView } from 'antd-mobile';



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

function MyBody(props) {
	return (
	  <div className="am-list-body my-body">
		<span style={{ display: 'none' }}>you can custom body wrap element</span>
		{props.children}
	  </div>
	);
  }

const NUM_SECTIONS = 5;
const NUM_ROWS_PER_SECTION = 5;
let pageIndex = 0;

const dataBlobs = {};
let sectionIDs = [];
let rowIDs = [];
function genData(pIndex = 0) {
	for (let i = 0; i < NUM_SECTIONS; i++) {
	  const ii = (pIndex * NUM_SECTIONS) + i;
	  const sectionName = `Section ${ii}`;
	  sectionIDs.push(sectionName);
	  dataBlobs[sectionName] = sectionName;
	  rowIDs[ii] = [];
  
	  for (let jj = 0; jj < NUM_ROWS_PER_SECTION; jj++) {
		const rowName = `S${ii}, R${jj}`;
		rowIDs[ii].push(rowName);
		dataBlobs[rowName] = rowName;
	  }
	}
	sectionIDs = [...sectionIDs];
	rowIDs = [...rowIDs];
  }

  const data = [
	{
	  img: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
	  title: 'Meet hotel',
	  des: '不是所有的兼职汪都需要风吹日晒',
	},
	{
	  img: 'https://zos.alipayobjects.com/rmsportal/XmwCzSeJiqpkuMB.png',
	  title: 'McDonald\'s invites you',
	  des: '不是所有的兼职汪都需要风吹日晒',
	},
	{
	  img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png',
	  title: 'Eat the week',
	  des: '不是所有的兼职汪都需要风吹日晒',
	},
  ];

class AppCompent extends React.Component{
	constructor(porps){
		super(porps);

		const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
    	const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];
		const dataSource = new ListView.DataSource({
			getRowData,
			getSectionHeaderData: getSectionData,
			rowHasChanged: (row1, row2) => row1 !== row2,
			sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
		  });
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
			dataSource:dataSource,
			isLoading: true,
			height: document.documentElement.clientHeight * 3 / 4,
		};
	}
	
	componentDidMount() {
		const hei =990;
		//  document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
		this.getData(1,this.state.searchkeyword);
		// setTimeout(() => {
		//   genData();
		//   this.setState({
		// 	dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
		// 	isLoading: false,
		// 	height: hei,
		//   });
		// }, 600);
	  }
	
	
	
	  onEndReached = (event) => {
		if (this.state.isLoading && !this.state.hasMore) {
		  return;
		}
		console.log('reach end', event);
		this.setState({ isLoading: true });
		var page = this.state.page + 1;
        console.log(page)
		this.setState({page: page});
        this.getData(page,this.state.searchkeyword);
	
	  }
	
	handleKeyword(e){
        this.setState({
			keyword: e.target.value
		});
	}
	

	handlesearch(value) {
		this.setState({page: 1});
		document.querySelector('.img-sec').scrollTop=0;
		this.setState({searchkeyword: value});
		this.getData(1,value) 
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
					genData();
					self.setState({
						dataSource: self.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
						isLoading: false,
						// height: hei,
					});
				  //父组件的setState  改变的自己的状态的同时触发了自组件的componentWillReceiveProps
				   // 子组件可以在componentWillReceiveProps里接受新的参数，改变自己的state会自动触发render渲染
				} else {
					genData(++pageIndex);
					self.setState({
						dataSource: self.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
						isLoading: false,
					});
				}
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
		
	
		let index = data.length - 1;
		const row = (rowData, sectionID, rowID) => {
		  if (index < 0) {
			index = data.length - 1;
		  }
		  const obj = data[index--];
		  return (
			<div key={rowID} style={{ padding: '0 15px' }}>
			  <div
				style={{
				  lineHeight: '50px',
				  color: '#888',
				  fontSize: 18,
				  borderBottom: '1px solid #F6F6F6',
				}}
			  >{obj.title}</div>
			  <div style={{ display: '-webkit-box', display: 'flex', padding: '15px 0' }}>
				<img style={{ height: '64px', marginRight: '15px' }} src={obj.img} alt="" />
				<div style={{ lineHeight: 1 }}>
				  <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>{obj.des}</div>
				  <div><span style={{ fontSize: '30px', color: '#FF6E27' }}>35</span>¥ {rowID}</div>
				</div>
			  </div>
			</div>
		  );
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
						ref={el => this.lv = el}
						dataSource={this.state.dataSource}
						// renderHeader={() => <span>header</span>}
						renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
						{this.state.isLoading ? 'Loading...' : 'Loaded'}
						</div>)}
						renderSectionHeader={sectionData => (
						<div>{`Task ${sectionData.split(' ')[1]}`}</div>
						)}
						renderBodyComponent={() => <MyBody />}
						renderRow={row}
						// renderSeparator={separator}
						style={{
						height: this.state.height,
						overflow: 'auto',
						}}
						pageSize={4}
						onScroll={() => { console.log('scroll'); }}
						scrollRenderAheadDistance={500}
						onEndReached={this.onEndReached}
						onEndReachedThreshold={10}
					/>	
					 </section>
				</section>
			</section>
		)
	}
	
}
export default AppCompent;