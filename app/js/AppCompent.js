import "../css/index.css"
import React from "react";
import Item from "./Item"
// import ListView from "./ListView"
import qs from 'qs';
import axios from "axios"
import 'react-tabs/style/react-tabs.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import swal from 'sweetalert';
import { ListView,  SearchBar } from 'antd-mobile';
import { runInThisContext } from "vm";

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
		const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
    	const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];
		const dataSource = new ListView.DataSource({
			getRowData,
			getSectionHeaderData: getSectionData,
			rowHasChanged: (row1, row2) => row1 !== row2,
			sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
		  });
		// this.handleKeyword = this.handleKeyword.bind(this);
		// this.handlesearch = this.handlesearch.bind(this);
		
		this.state = {
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
		genData();
		this.getData(1,this.state.searchkeyword);
	  }
	
	
	
	  onEndReached = (event) => {
		if (!this.state.isLoading && !this.state.hasMore) {
		  return;
		}
		this.setState({page: this.state.page + 1});
		genData(++pageIndex);
        this.getData(this.state.page, this.state.searchkeyword);
	
	  }
	

	onSearch = (val) => {
		// pageIndex = 0;
		genData(++pageIndex);
		document.querySelector('.img-sec').scrollTop=0;
		this.setState({
		  page: 1,
		  searchkeyword: val,
		});
		console.log(val)
		this.getData(this.state.page, val);
	  }

	  
    getData(page,searchWord) {//获取数据的函数
		var self = this;
		var data={};
		data.page = page;
		data.perpage = pageSize;
		data.search=searchWord;
		axios.post('https://eexx.me/sina/api/public/?s=Projects.getList',qs.stringify(data)).then(function(response){
			if(response.data.ret == 200 ){
				if (response.data.data.page == 1) {//如果是第一页，直接覆盖之前的数据

					self.setState({
						article:[...response.data.data.items],
						dataSource: self.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
						// isLoading: false,
						// height: hei,
					});
					console.log(self.state.article);
					if(response.data.data.total <= page * pageSize)
					self.setState({ isLoading: false });
				} else {
					
					self.setState({
						article:[...self.state.article,...response.data.data.items],
						dataSource: self.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
						// isLoading: false,
					});
					if(response.data.data.total <= page * pageSize)
					self.setState({ isLoading: false });
				}
			}else{
				swal(response.data.msg);
			}
			
		})
        
    }
	render(){
		let index = 0;
		const row = (rowData, sectionID, rowID) => {
		  if (index >  this.state.article.length - 1) {
			index = 0;
		  }
		  const obj = this.state.article[index++];
		  return (
			<div key={rowID} style={{ padding: '0 15px' }}><a href={obj.link}>
			  <div
				style={{
				  lineHeight: '50px',
				  color: '#888',
				  fontSize: 18,
				  borderBottom: '1px solid #F6F6F6',
				}}
			  >{obj.title}</div>
			  <div style={{ display: '-webkit-box', display: 'flex', padding: '15px 0' }}>
				<img style={{ height: '64px', marginRight: '15px' }} src={obj.imgurl} alt="" />
				<div style={{ lineHeight: 2 }}>
				  <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>{obj.tags}</div>
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
					onChange={this.onSearch}
					onClear={() => { console.log('onClear'); }}
					onCancel={() => { console.log('onCancel'); }}
					/>
				<section className="stage" ref="stage">
					<section className="img-sec">
					  <ListView
						ref={el => this.lv = el}
						dataSource={this.state.dataSource}
						// renderHeader={() => <span>header</span>}
						renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
						{this.state.isLoading ? 'Loading...' : 'Loaded'}
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