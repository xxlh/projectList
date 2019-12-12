import React from "react"
import 'antd-mobile/dist/antd-mobile.css'; 

import { Tabs, Badge, WhiteSpace, Tag } from 'antd-mobile';
import Axios from "axios";


var set = new Set();
var map = new Map();
class SearchTabs extends React.Component{
	constructor(porps){
		super(porps);
		this.state = {
			tabTitle : [],
			tag:[]
		}
	}
	getData(){
		Axios.post("https://sina.ieexx.com/api/public/?s=Keyword.getKeyword").then((response)=>{
			if(response.data.ret == 200){
				response.data.data.items.map(item=>{
					set.add(item.labletitle);
					map.set(item.labletitle,item.title);

				})
				
				this.setState({
					tabTitle : [...set],
					tag : [...map]
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
				<div key = {index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: '#fff' }}>
				{map.get(tab).values()}
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