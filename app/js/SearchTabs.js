import React from "react"
import 'antd-mobile/dist/antd-mobile.css'; 

import { Tabs, WhiteSpace, Badge } from 'antd-mobile';
import Axios from "axios";


const tabs = [
	{ title: <Badge>功能</Badge> },
	{ title: <Badge>行业</Badge> },
	{ title: <Badge>客户</Badge> },
	{ title: <Badge>时间</Badge> },
  ];

// let tabs = new Set();
class SearchTabs extends React.Component{
	constructor(porps){
		super(porps);
		this.state = {
			
		}
	}
	getData(){
		Axios.post("https://eexx.me/sina/api/public/?s=Keyword.getKeyword",{}).then((response)=>{
			if(response.data.ret == 200){
				response.data.data.items.map(item=>{
					tabs.add(`{ title: <Badge>${item.labletitle}</Badge>}`)

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
			<Tabs tabs={tabs}
				initialPage={1}
				onChange={(tab, index) => { console.log('onChange', index, tab); }}
				onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
			>
			<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: '#fff' }}>
			{}
			</div>
				
			</Tabs>
			<WhiteSpace />
			</div>
		)
	}
}

export  default SearchTabs;