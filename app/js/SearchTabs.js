import React from "react"
import 'antd-mobile/dist/antd-mobile.css'; 

import { Tabs, Badge, WhiteSpace, Tag } from 'antd-mobile';
import Axios from "axios";


const tabs = [
	{ title: <Badge>功能</Badge> },
	{ title: <Badge>行业</Badge> },
	{ title: <Badge>客户</Badge> },
	{ title: <Badge>时间</Badge> },
  ];
// const tab = [
// 	{ labletitle: "功能"},
// 	{ labletitle: "行业"},
// 	{ labletitle: "客户"},
// 	{ labletitle: "时间"},
//   ];
// let tabs = new Set();
let tagList ='';
class SearchTabs extends React.Component{
	constructor(porps){
		super(porps);
		this.state = {
		}
	}
	getData(){
		Axios.post("http://sina.ieexx.com/api/public/?s=Keyword.getKeyword").then((response)=>{
			if(response.data.ret == 200){
				response.data.data.items.map(item=>{
					if(item.labletitle == "功能") {
						tagList +=`<Tag >${item.title}</Tag>`
					}

				})
			}
		})
	}
	componentDidMount() {
        this.getData();
    }
	render(){
		const row = `<div >
			{tagList}
		</div>`;
		return (
			<div>
			<Tabs tabs={tabs}
				initialPage={0}
				onChange={(tab, index) => { console.log('onChange', index, tab); }}
				onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
			>
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: '#fff' }}>
				{row}
			</div>
			<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: '#fff' }}>
				Content of second tab
			</div>
			<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: '#fff' }}>
				Content of third tab
			</div>
			</Tabs>
			<WhiteSpace />
			</div>
		)
	}
}

export  default SearchTabs;