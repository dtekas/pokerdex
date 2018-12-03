let path = require('path');

/*
* We can set up config for multiple environments using this approach.
* 
* */
module.exports = Object.assign(
	require(path.join(__dirname, 'env', 'all.js')),
	// require(path.join(__dirname, 'env', `${process.env.ENV}.js`))
);