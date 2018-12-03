let config = require("../config/config");
let ApiClient = require("../lib/ApiClient");
let _ = require('lodash');

const pokemonHost = config.pokemon.host;

let PokemonApi = {
	"getByNameOrId": _.template(`${pokemonHost}/api/v2/pokemon/<%= poke %>`),
	"getByType": _.template(`${pokemonHost}/api/v2/type/<%= type %>`),
	"getSpecies": _.template(`${pokemonHost}/api/v2/pokemon-species/<%= name %>`)
};

class Pokemon {
	constructor(options) {
		Object.assign(this, options);
	}

	toPokeDexClientJson() {
		let pokeMon = _.pick(this, ['name', 'id', 'height', 'weight', 'species']);
		if(this.sprites) {
			let spriteKey = Object.keys(this.sprites).find(key => this.sprites[key] != null);
			pokeMon.thumbNail = spriteKey !== undefined ? this.sprites[spriteKey] : "https://image.ibb.co/j21Mgo/2262554_1.jpg";
		}

		//Assumption: The urls are internal to say our services. In general would not be public. So mask/override those keys.
		//One of my learning has been not to expose such data to the client (if for some bug those services become public, these urls make them vulnerable).
		// pokeMon.types.map(t => t.type.url = "####");
		pokeMon.species.url = "####";
		pokeMon.type = this.types.reduce((acc, curr) => acc.concat(curr.type.name), []).join(",");
		return pokeMon;
	}
}
class PokemonSpecies {
	constructor(obj) {
		Object.assign(this, obj);
	}

	toPokeDexClientJson() {
		let species = _.pick(this, ['habitat', 'flavor_text_entries']);
		return {
			habitat: species.habitat.name,
			flavoredText: this.flavoredText("en")
		}
	}

	flavoredText(flavor) {
		let fte = this.flavor_text_entries.filter(ftext=> ftext.language.name === flavor);
		return fte.length == 0 ? null : fte[0].flavor_text.split("\n");
	}
}

class PokemonType {
	constructor(obj) {
		Object.assign(this, obj);
	}

	toPokeDexClientJson() {
		let pokemons = [];
		this.pokemon.forEach(p=> pokemons.push({name: p.pokemon.name}));
		return pokemons;
	}
}

class PokemonServices {

	/*
	* @nid: pokemon id or name
	* return Pokemon object
	*/
	static getByNameOrId(nid) {
		let url = PokemonApi.getByNameOrId({
			poke: nid
		});
		return ApiClient.apiGet(url).then(result => {
			let pokeObj = new Pokemon(result);
			return pokeObj;
		})
	}

	/*
	* @name: pokemon name
	* return PokemonSpecies object
	*/
	static getSpeciesDetail(name) {
		let url = PokemonApi.getSpecies({
			name: name
		});
		return ApiClient.apiGet(url).then(result => {
			let pokemonSpecies = new PokemonSpecies(result);
			return pokemonSpecies;
		})
	}

	/*
	* @type: pokemon type
	* return PokemonType object
	*/

	static getByType(type) {
		let url = PokemonApi.getByType({
			type: type
		});
		return ApiClient.apiGet(url).then(result => {
			let pokemonType = new PokemonType(result);
			return pokemonType;
		})
	}

}

module.exports = {PokemonServices};

//Expose all classes for unit testing
if(process.env.ENV == "CI") {
	module.exports = {Pokemon, PokemonSpecies, PokemonType, PokemonServices}
}