let _ = require('lodash');
let PokemonServices = require("./PokemonServices").PokemonServices;
let dummy = require("./Dummy");

let handleErrors = (res, error) => {
	res.status(500).json({
		success: false,
		code: error.code,
		message: error.message
	});
};


exports.searchPokemons = (req, res, payload = {}) => {
	console.log(dummy);
	let q = req.query.q || payload.searchquery;
	if(_.isUndefined(q)) {
		return handleErrors(res, {code: "INVALID_REQUEST", message: "invalid request"});
	}
	PokemonServices.getByNameOrId(q).then(result=> {
		result = result.toPokeDexClientJson();
		if(parseInt(result.id) > 151) {
			return Promise.reject({code: "NOT_FOUND_CLASSIC", "message": "Not present in classic set"});
		}
		return PokemonServices.getSpeciesDetail(result.species.name).then(speciesDetail => {
			Object.assign(result, speciesDetail.toPokeDexClientJson());
			return result;
		});
	}).then(result => {
		res.send(result);
	}).catch(err=> {
		handleErrors(res, err);
	})
};

exports.searchByType = (req, res, payload = {}) => {
	let type = req.params.type || payload.searchquery;
	if(_.isUndefined(type)) {
		return handleErrors(res, {code: "INVALID_REQUEST", message: "invalid request"});
	}
	PokemonServices.getByType(type).then(result => {
		//Filter to limit till id 151
		result.pokemon = result.pokemon.filter(p=> {
			let url = p.pokemon.url.split("/");
			let id = url[url.length - 2];
			return id <= 151;
		});
		res.send(result.toPokeDexClientJson());
	}).catch(err=> {
		handleErrors(res, err);
	})
};
