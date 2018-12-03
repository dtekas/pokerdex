import React from 'react';

class Header extends React.Component {
	render() {
		return(
			<header className="App-header">
				<div className="App-header-content">
					<img src="https://i.ebayimg.com/images/g/S5cAAOSwX0xbOQhi/s-l640.jpg" className="App-logo" alt="logo" />
					<div className="App-title">Pokedex</div>
				</div>
			</header>
		)
	}
}

export default Header;