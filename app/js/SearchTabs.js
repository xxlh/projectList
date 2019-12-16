import React from "react"
import 'antd-mobile/dist/antd-mobile.css'; 

import { Tabs, Badge, WhiteSpace, Tag } from 'antd-mobile';
import Axios from "axios";


const tabTitle=[];
const tags =[];
class SearchTabs extends React.Component{
	constructor(porps){
		super(porps);
		this.state = {
			tabTitle : [],
			tags : [],
		}
		// this.back = this.back.bind(this);
	}
	back=(val)=>{// 子组件的点击事件
		this.props.hotSubmit(val) // 这个changeData()就是激活父组件的方法，可以传值
	  }
	getData(){
		Axios.post("https://sina.ieexx.com/api/public/?s=Keyword.getKeyword").then((response)=>{
			if(response.data.ret == 200){
				response.data.data.items.map(item =>{
					tabTitle.push({title:item.labletitle})
					let objkey = item.labletitle;
					let obj = {};
					obj[objkey] = item.title
					tags.push(obj);
				})
				console.log(tags);
				const obj = {}
				const newObjArr =  tabTitle.reduce((prev, curr)=>{
				  obj[curr.title] ? true : obj[curr.title] = true && prev.push(curr);
				  return prev
				}, []);



				this.setState({
					tabTitle : [...newObjArr],
					tags : [...tags],
				})
			}
		})
	}
	componentDidMount() {
        this.getData();
	}
	
	render(){
		return (
			<div>
			<Tabs tabs={this.state.tabTitle}
				initialPage={0}
				onChange={(tab, index) => { console.log('onChange', index, tab); }}
				onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
			>
			{
			this.state.tabTitle.map((tab,index) =>
				<div key = {index} style={{ display: 'flex', padding: '0.2rem', flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#fff' }}>
				{
					this.state.tags.filter((item) =>
						item[tab.title]
					).map((tagItem,index) => 
					<div key = {index} style={{width:'1.7rem', margin: '0.2remx',textAlign:'center', fontSize:'15px'}} 
						onClick={this.back.bind(this,tagItem[tab.title])}>{tagItem[tab.title]}</div>
					)
				}
				</div>
			)
			}
			
			</Tabs>
			<WhiteSpace />
			</div>
		)
	}
}

export  default SearchTabs;