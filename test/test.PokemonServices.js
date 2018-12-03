const chai = require('chai'),
	expect = chai.expect,
	nock = require('nock'),
	PROJECT_ROOT = process.cwd();

const {Pokemon, PokemonSpecies, PokemonType, PokemonServices} = require(`${PROJECT_ROOT}/services/PokemonServices.js`);
describe("PokemonServices test: ", () => {

	it('should verify toPokeDexClientJson of Pokemon class', (done) => {
		let pokejson = require(`${PROJECT_ROOT}/test/data/Pokemon.json`);
		let pokeObj = new Pokemon(pokejson);
		let pokeDexJson = pokeObj.toPokeDexClientJson();
		expect(pokeDexJson).to.have.keys([ 'name', 'id', 'height', 'weight', 'species', 'thumbNail', 'type']);
		expect(pokeDexJson.species).to.have.property("name", "ivysaur");
		expect(pokeDexJson.species).to.have.property("url", "####");
		expect(pokeDexJson.height).equal(10);
		expect(pokeDexJson.weight).equal(130);
		expect(pokeDexJson.thumbNail).equal("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/2.png");

		//Default thumbNail test when no sprite is available
		pokeObj.sprites = {};
		expect(pokeObj.toPokeDexClientJson().thumbNail).equal("https://image.ibb.co/j21Mgo/2262554_1.jpg");

		done();
	});

	it('should verify toPokeDexClientJson of PokemonSpecies class', (done) => {
		let pokejson = require(`${PROJECT_ROOT}/test/data/PokemonSpecies.json`);
		let pokeObj = new PokemonSpecies(pokejson);
		let pokeDexJson = pokeObj.toPokeDexClientJson();
		expect(pokeDexJson).to.have.keys(['habitat', 'flavoredText']);
		expect(pokeDexJson.flavoredText).to.be.an('array');
		expect(pokeDexJson.flavoredText.length).equal(3);
		done();
	});

	it('should verify toPokeDexClientJson of PokemonType class', (done) => {
		let pokejson = require(`${PROJECT_ROOT}/test/data/PokemonType.json`);
		let pokeObj = new PokemonType(pokejson);
		let pokeDexJson = pokeObj.toPokeDexClientJson();
		expect(pokeDexJson).to.be.an('array');
		expect(pokeDexJson.length).equal(70);
		done();
	});

});