import React from 'react';
import Header from './Components/Header';
import SearchForm from './Components/SearchForm';
import Pokemon from './Components/Pokemon';

import './App.css';

class App extends React.Component {
    constructor() {
        super()
        this.state = {
            searchInProgress: false,
            pokemons: [],
            fetchError: false
        }
        this.errorMessage = {
            "NOT_FOUND_CLASSIC": "Not present in classic set",
            "NOT_FOUND": "No Pokemons found for given query",
            "DEFAULT": "Something went wrong!!"
        }
    }

    formSubmit(formData) {
        this.setState({
	        searchInProgress: true,
            pokemons: [],
	        fetchError: false
        });
	    let me = this;
	    let url = "/search";
	    fetch(url, {
		    method: "POST", headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}, body: JSON.stringify(formData)
	    }).then((response) => {
	        if(!response.ok) {
	            throw response;
	        }
	        return response.json()
	    }).then((result) => {
	        let pokemon = me.state.pokemons.slice();
		    me.setState({
			    searchInProgress: false,
                pokemons: pokemon.concat(result)
		    })
	    }).catch((error) => {
	        error.json().then(e => {
		        let errorMsg = this.errorMessage[e.code] || this.errorMessage["DEFAULT"];
		        me.setState({
			        searchInProgress: false,
			        fetchError: true,
			        errorMsg: errorMsg
		        })
            })
	    })

    }
	render() {
        let pokemons = this.state.pokemons.map(p => {
            return (
                <Pokemon key={p.name} data={p}/>
            )
        });

		return (
			<div className="App">
				<Header/>
				<div className="container">
					<div id="poke-app">
						<h4>The pokemon wiki</h4>
						<SearchForm onSubmit={this.formSubmit.bind(this)} progress={this.state.searchInProgress}/>
                        {this.state.pokemons.length > 0 ?
                            <section>
                                {pokemons}
                            </section> : null}
                        {this.state.fetchError ? <section><div className={"error"}>
                            {this.state.errorMsg}
                        </div></section> : null}
					</div>
				</div>
			</div>
		);
	}
}
export default App;
