import "../css/SearchBar.css"
import React from "react"
import 'antd/dist/antd.css'
import { Input } from 'antd'

class SearchBar extends React.Component{
	

	constructor(props){
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}
	
	handleClick(){
		this.props.searchSubmit(this.props.keyChange);
	}
	
	render(){
		const Search = Input.Search;
		return(
			<Search
				placeholder="input search text"
				onSearch={value => this.props.searchSubmit(value)}
				enterButton
			/>
		)
	}

}
export default SearchBar;