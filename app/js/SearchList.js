import React from "react";
import "../css/SearchList.css"


class SearchList extends React.Component{
	
	constructor(props){
		super(props);
		this.handleHotWord = this.handleHotWord.bind(this);
	}
	handleHotWord(){
		this.props.hotSubmit(this.props.title);
	}
	render(){
		return(
			<div>
				<li className="search-title"  onClick={this.handleHotWord}>{this.props.title}</li>
			</div>
		)
	}

}
export default SearchList;