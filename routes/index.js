var express = require('express');
var router = express.Router();

const Pokedex = require('../services/Pokedex');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', {});
// });

router.post('/search', (req, res) => {
    let payload = req.body || {};
    if(payload.stype === "pmtype") {
        return Pokedex.searchByType(req, res, payload);
    } else {
	    return Pokedex.searchPokemons(req, res, payload);
    }
});

router.get('/search/pokemon', Pokedex.searchPokemons);
router.get('/search/type/:type', Pokedex.searchByType);


module.exports = router;
