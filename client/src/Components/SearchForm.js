import React from 'react';
import Loader from './Loader';
import PropTypes from 'prop-types';

class SearchForm extends React.Component {
	static get propTypes() {
		return {
			onSubmit: PropTypes.func.isRequired,
			progress: PropTypes.bool.isRequired
		}
	}
	constructor(props){
		super(props);
		this.state = {
			stype: "pmname",
			searchquery: ""
		}
	}

	handleInputChange(field, e) {
		this.setState({
			[field]: e.currentTarget.value
		})
	}

	handleSubmit(e) {
		e.preventDefault();
		// if(this.state.stype === "pmid" && parseInt(this.state.searchquery) > 151) {
		// 	alert("wooo");
		// 	return;
		// }
		if(this.props.onSubmit) {
			this.props.onSubmit(this.state);
		}
	}

	render() {
		let searchOptions = [
			{
				"label": "Name",
				"value": "pmname"
			},{
				"label": "Id",
				"value": "pmid"
			},{
				"label": "Type",
				"value": "pmtype"
			}];

		let optionsInput = searchOptions.map(so => {
			return(
				<div className="form-check form-check-inline" key={so.value}>
					<input className="form-check-input" type="radio" value={so.value}
					       onChange={this.handleInputChange.bind(this, "stype")} //Should be changed to subcomponent and let the child pass the type, value to parent.
					       checked={this.state.stype === so.value}/>
					<label className="form-check-label" htmlFor={so.value}>{so.label}</label>
				</div>
			)
		});

		return(
			<section>
				<form id="pm-search" onSubmit={this.handleSubmit.bind(this)}>
					<div className="form-group">
						{optionsInput}
					</div>
					<div className="row">
						<div className="form-group col-md-10 col-lg-6">
							<label htmlFor="searchquery" className="sr-only">Search Query</label>
							<input className="form-control" type="text" placeholder="search" value={this.state.searchquery}
							       onChange={this.handleInputChange.bind(this, "searchquery")}
							       required/>
						</div>
					</div>
					{this.props.progress ? <Loader/> : <button type="submit" className="btn btn-primary">Search</button>}
				</form>
			</section>
		)
	}
}

export default SearchForm;