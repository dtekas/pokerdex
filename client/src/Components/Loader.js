import React from 'react';


class Loader extends React.Component {

	render() {
		return (
			<span className="spinner" > <div className="bounce1"></div> <div className="bounce2"></div> <div className="bounce3"></div> </span>
		)
	}
}

export default Loader;