import "../css/index.css"
import React from "react";
import Item from "./Item"
// import ListView from "./ListView"
import qs from 'qs';
import axios from "axios"
import 'react-tabs/style/react-tabs.css';
import SearchTabs from './SearchTabs';
import swal from 'sweetalert';
import { ListView,  SearchBar, PullToRefresh } from 'antd-mobile';

function MyBody(props) {
	return (
	  <div className="am-list-body my-body">
		<span style={{ display: 'none' }}>you can custom body wrap element</span>
		{props.children}
	  </div>
	);
  }

const NUM_SECTIONS = 1;
const NUM_ROWS_PER_SECTION = 10;
const pageSize = NUM_ROWS_PER_SECTION;
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

  

class AppCompent extends React.Component{
	constructor(porps){
		super(porps);
	
		const dataSource = new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
		  });

		// this.handleKeyword = this.handleKeyword.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		
		this.state = {
			keyword: [],
			tabIndex: 0,
			searchkeyword:'',
			hotKeyword : "" ,
			page: 1,
			article: [],//文章列表
			total:0,
			dataSource:dataSource,
			isLoading: true,
			refreshing: true,
			hasMore: true,
			height: document.documentElement.clientHeight * 2 / 3,
		};
	}
	
	componentDidMount() {
		this.getData(1, this.state.hotKeyword);
	  }
	
	  onRefresh = () => {
		  this.setState({
			  page : 1 ,
			  searchkeyword : "" ,
			//   hotKeyword : "" ,
		  },() => this.getData(this.state.page, this.state.hotKeyword));
	};

	onEndReached = (event) => {
		if (!this.state.hasMore) {
			return;
		}
		let page = this.state.page + 1;
		this.setState({ isLoading: false });
		this.setState({page: this.state.page + 1},
			()=>{ console.log("page:" + this.state.page)
				this.getData(this.state.page, this.state.hotKeyword)});
				console.log("page:" + this.state.page);
				this.getData(this.state.page, this.state.hotKeyword)
	  }
	
	
	  onChange= (value) => {
		this.setState({ searchkeyword: value});
	  };
	  clear = () => {
		this.setState({ searchkeyword: '' });
	  };
	  handleClick = () => {
		this.manualFocusInst.focus();
	  }
	  handleSearch = (val) => {
		this.lv.scrollTo(0,0)
		this.setState({
			hasMore: true,
			refreshing: true,
			isLoading: true, 
			page: 1,
			hotKeyword: val,
		}, () => this.getData(this.state.page, this.state.hotKeyword));
		
	  }

	  
    getData(page,searchWord) {//获取数据的函数
		var self = this;
		var data={};
		data.page = page;
		data.perpage = pageSize;
		data.search=searchWord;
		axios.post('https://sina.ieexx.com/api/public/?s=Projects.getList',qs.stringify(data)).then(function(response){
			if(response.data.ret == 200 ){
				if (response.data.data.page == 1) {//如果是第一页，直接覆盖之前的数据
					self.setState({
						article:[...response.data.data.items]
					});
				} else {
					self.setState({
						article:[...self.state.article, ...response.data.data.items],
					});
				}
				self.setState({
					dataSource: self.state.dataSource.cloneWithRows(self.state.article),
				});
				if(response.data.data.total <= page * pageSize)
					self.setState({ 
						hasMore: false,
						refreshing: false,
						isLoading: false, 
					});
			}else{
				swal(response.data.msg);
			}
			
		})
        
    }
	render(){
		let index = 0;
		const row = (rowData, sectionID, rowID) => {
		  return (
			<div key={rowID} style={{ padding: '0 15px' }}><a href={rowData.link}>
			  <div
				style={{
				  lineHeight: '50px',
				  color: '#888',
				  fontSize: 18,
				  borderBottom: '1px solid #F6F6F6',
				}}
			  >{rowData.title}</div>
			  <div style={{ display: '-webkit-box', display: 'flex', padding: '.15rem 0' }}>
				<img style={{ height: '64px', marginRight: '15px' }} src={rowData.imgurl} alt="" />
				<div style={{ lineHeight: 2 }}>
				  <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>{rowData.tags}</div>
				  {/* <div><span style={{ fontSize: '30px', color: '#FF6E27' }}>35</span>¥ {rowID}</div> */}
				</div>
			  </div>
			  </a>
			</div>
		  );
		};
	
		return(
			<section className="page">
				 <SearchBar
				 	value={this.state.searchkeyword}
					 placeholder="Search"
					 onSubmit={value => this.handleSearch(value)}
					 onClear={value => this.handleSearch(value)}
					 onFocus={() => console.log('onFocus')}
					 onBlur={() => console.log('onBlur')}
					 onCancel={value => this.handleSearch("")}
					 showCancelButton
					 onChange={this.onChange}
					/>
					<SearchTabs hotSubmit = {value => this.handleSearch(value)}/>
				<section className="stage" ref="stage">
					<section className="img-sec">
					  <ListView
						ref={el => this.lv = el}
						dataSource={this.state.dataSource}
						// renderHeader={() => <span>header</span>}
						renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
						{this.state.isLoading ? 'Loading...' : (!this.state.hasMore&&'没有更多了~')}
						</div>)}
						renderBodyComponent={() => <MyBody />}
						renderRow={row}
						style={{
						height: this.state.height,
						overflow: 'auto',
						}}
						pageSize= { pageSize }
						onScroll={() => { console.log('scroll'); }}
						scrollRenderAheadDistance={500}
						pullToRefresh={<PullToRefresh
							refreshing={this.state.refreshing}
							onRefresh={this.onRefresh}
						/>}
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