import React from 'react';
import Loader from './Loader'
import PropTypes from 'prop-types';

class Pokemon extends React.Component {
	static get propTypes() {
		return {
			data: PropTypes.object.isRequired
		}
	}
	constructor(props) {
		super(props);
		this.state = {
			hasInfo: this.props.data.id !== undefined,
			progress: false,
			expanded: this.props.data.id !== undefined,
			data: this.props.data,
			fetchError: false
		}
	}

	expandDetails() {
		if(this.state.progress) {
			return;
		}
		if(!this.state.hasInfo) {
			this.setState({
				progress: true,
				fetchError: false
			});
			let url = `/search/pokemon?q=${this.state.data.name}`,
				me = this;
			fetch(url, {
			   headers: {
			    'Accept': 'application/json',
			    'Content-Type': 'application/json'
			   }
			}).then((response) => {
			    if(!response.ok) {
			        throw response;
			    }
			    return response.json()
			}).then((result) => {
			    me.setState({
			        progress: false,
			        data: result,
				    hasInfo: true,
				    expanded: true
			   })
			}).catch((error) => {
			   me.setState({
				   progress: false,
				   fetchError: true
			   })
			})
		} else {
			this.setState({
				expanded: !this.state.expanded
			})
		}
	}

	render() {
		let data = this.state.data;
		let caretClass = `caret caret${this.state.expanded ? "-down" :"-right"}`;
		return(
			<div className="Pokemon">
				<div className="Pokemon-title" onClick={this.expandDetails.bind(this)}>
					<span className={caretClass}></span>
					<span>{data.name}</span>
					{data.thumbNail ? <span><img className={"thumbnail"} src={data.thumbNail} alt={`${data.name} pokemon`} /></span> : null}
					{this.state.progress ? <Loader/> : null}
					{this.state.fetchError? <span className={"error"}>Something went wrong!!</span> : null}
				</div>
				{this.state.hasInfo && this.state.expanded?
					<div className="Pokemon-info row">
						<div className={"col-sm-4 group"}>
							<div className={"subgroup"}>
								<div className="attr">Id</div>
								<div className="val">{data.id}</div>
							</div>
							<div className={"subgroup"}>
								<div className="attr">Height</div>
								<div className="val">{data.height}</div>
							</div>
							<div className={"subgroup"}>
								<div className="attr">Weight</div>
								<div className="val">{data.weight}</div>
							</div>
						</div>
						<div className={"col-sm-4 group"}>
							<div className={"subgroup"}>
								<div className="attr">Species</div>
								<div className="val">{data.species.name}</div>
							</div>
							<div className={"subgroup"}>
								<div className="attr">Type</div>
								<div className="val">{data.type}</div>
							</div>
							<div className={"subgroup"}>
								<div className="attr">Habitat</div>
								<div className="val">{data.habitat}</div>
							</div>
						</div>
						<div className={"col-sm-4 group"}>
							<div className={"subgroup"}>
								<div className="attr">Flavored Text</div>
								<div className="val">{data.flavoredText.map((ft, id) => <span key={"ft" + id}>{ft}</span>)}</div>
							</div>
						</div>
					</div> : null}
			</div>
		)
	}
}

export default Pokemon;