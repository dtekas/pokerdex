const chai = require('chai'),
	expect = chai.expect,
	nock = require('nock'),
	http_mocks = require('node-mocks-http'),
	mockery = require('mockery'),
	sinon = require('sinon'),
	PROJECT_ROOT = process.cwd();

const Pokedex = require(`${PROJECT_ROOT}/services/Pokedex.js`),
	  pokemonJson = require(`${PROJECT_ROOT}/test/data/Pokemon.json`),
	  pokemon202Json = require(`${PROJECT_ROOT}/test/data/Pokemon202.json`),
	  speciesJson = require(`${PROJECT_ROOT}/test/data/PokemonSpecies.json`),
	  pokeTypeJson = require(`${PROJECT_ROOT}/test/data/PokemonType.json`);

let buildResponse = () =>{
	return http_mocks.createResponse({eventEmitter: require('events').EventEmitter})
};

describe("Pokedesk - ", () => {
	beforeEach(() => {
		nock.disableNetConnect();
	});

	describe("searchPokemons tests : ", () => {
		before(()=> {
			nock('https://pokeapi.co')
			.get('/api/v2/pokemon/2')
			.reply(200, pokemonJson)
			.get('/api/v2/pokemon/202')
			.reply(200, pokemon202Json)
			.get('/api/v2/pokemon/somerandom')
			.reply(404, {"detail":"Not found."})
			.get('/api/v2/pokemon-species/ivysaur')
			.reply(200, speciesJson);
		});
		it('should get error json from searchPokemons', (done) => {
			let response = buildResponse();
			let request  = http_mocks.createRequest({
				method: 'GET',
				url: '/search/pokemon?q=',
			});

			response.on('end', function() {
				expect(response._getStatusCode()).equal(500);
				let result = JSON.parse(response._getData());
				expect(result.success).equal(false);
				expect(result.code).equal("INVALID_REQUEST");
				done()
			});
			Pokedex.searchPokemons(request, response);
		});

		it('should get valid response from searchPokemons', (done) => {
			let response = buildResponse();
			let request  = http_mocks.createRequest({
				method: 'GET',
				url: '/search/pokemon?q=2',
			});

			response.on('end', function() {
				let result = response._getData();
				expect(result).to.have.keys(['name', 'id', 'height', 'weight', 'species', 'thumbNail', 'type', 'habitat', 'flavoredText']);
				expect(Object.keys(result).length).equal(9);
				expect(result.habitat).equal("mountain");
				expect(result.type).equal("poison,grass");
				done();
			});
			Pokedex.searchPokemons(request, response);
		});

		it('should return error for searchPokemons of id > 151', (done) => {
			let response = buildResponse();
			let request  = http_mocks.createRequest({
				method: 'GET',
				url: '/search/pokemon?q=202',
			});

			response.on('end', function() {
				let result = JSON.parse(response._getData());
				expect(result.success).equal(false);
				expect(result.code).equal("NOT_FOUND_CLASSIC");
				done()
			});
			Pokedex.searchPokemons(request, response)
		});

		it('should return error for searchPokemons with invalid keyword', (done) => {
			let response = buildResponse();
			let request  = http_mocks.createRequest({
				method: 'GET',
				url: '/search/pokemon?q=somerandom',
			});

			response.on('end', function() {
				let result = JSON.parse(response._getData());
				expect(result.success).equal(false);
				expect(result.code).equal("NOT_FOUND");
				done()
			});
			Pokedex.searchPokemons(request, response)
		});
	})

	describe("searchByType tests : ", () => {
		before(()=> {
			nock('https://pokeapi.co')
			.get('/api/v2/type/poison')
			.reply(200, pokeTypeJson)
			.get('/api/v2/type/somerandom')
			.reply(404, {"detail": "Not found."})
		});

		it("should return error for invalid types", (done) => {
			let response = buildResponse();
			let request  = http_mocks.createRequest({
				method: 'GET',
				url: '/search/type/somerandom',
				params: {
					type: "somerandom"
				}
			});

			response.on('end', function() {
				let result = JSON.parse(response._getData());
				expect(result.success).equal(false);
				expect(result.code).equal("NOT_FOUND");
				done()
			});
			Pokedex.searchByType(request, response)
		});

		it("should return error for missing req param type field", (done) => {
			let response = buildResponse();
			let request  = http_mocks.createRequest({
				method: 'GET',
				url: '/search/type/somerandom',
				params: {
				}
			});

			response.on('end', function() {
				let result = JSON.parse(response._getData());
				expect(result.success).equal(false);
				expect(result.code).equal("INVALID_REQUEST");
				done()
			});
			Pokedex.searchByType(request, response)
		});

		it("should get valid response from searchByType", (done) => {
			let response = buildResponse();
			let request  = http_mocks.createRequest({
				method: 'GET',
				url: '/search/type/poison',
				params: {
					type: "poison"
				}
			});

			response.on('end', function() {
				let result = response._getData();
				expect(result).to.be.an('array');
				expect(result.length).equal(33);
				expect(result[0]).to.have.keys(['name']);
				done()
			});
			Pokedex.searchByType(request, response)
		});
	})
});