import "../css/ProItem.css"
import React from "react";

class Item extends React.Component{

	constructor(props){
		super(props);
	}
	render(){
		return(
			<div className="pro-content">
				<a href={this.props.article.link}>
				<p className="img-title">{this.props.article.title}</p>
				{/* <div className="img-url">	
					<img src={this.props.article.imgurl} />
				</div> */}
				<div className="img-des"><p>标签：{this.props.article.tags}</p></div>
				</a>
			</div>
		)
	}

}
export default Item;
